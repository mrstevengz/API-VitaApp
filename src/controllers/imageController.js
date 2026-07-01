import sharp from "sharp";
import { analyzeImage } from "../services/geminiService.js";
import prisma from "../prismaClient.js";

export async function analyze(req, res) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No image uploaded" });
    }

    const resized = await sharp(req.file.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    const catalog = await prisma.meal.findMany({
      select: { id: true, name: true },
    });
    const allowedNames = catalog.map((m) => m.name);

    const detected = await analyzeImage(resized, "image/jpeg", allowedNames);

    const results = detected.map((item) => {
      const match = catalog.find((m) => m.name === item.catalogMatch);
      return {
        detectedName: item.detectedName,
        mealId: match?.id ?? null, // null cuando Gemini devuelve "NO_MATCH"
        mealName: match?.name ?? null,
        estimatedGrams: item.estimatedGrams,
      };
    });

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
