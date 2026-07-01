import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeImage(imageBuffer, mimeType, allowedNames) {
  const prompt = `
You are an AI that identifies foods for a nutrition tracking application.

Your task:

1. Detect every edible food item in the image.
2. Give the common name of each detected food.
3. Match each food to exactly one catalog item from this list:

${allowedNames.join(", ")}

Rules:

- Never create a new catalog name.
- Only select a catalog item if it is the same food.
- If no suitable catalog item exists, return "NO_MATCH".
- Ignore non-food objects.
- Estimate only the edible portion.
- Estimate weight in grams.
- If a dish contains multiple foods (for example rice, chicken and broccoli), return each food separately whenever they can be distinguished.
- If foods cannot reasonably be separated (for example lasagna), treat the entire dish as one item.
`;
  const base64 = imageBuffer.toString("base64");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },

          { inlineData: { mimeType, data: imageBuffer.toString("base64") } },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            detectedName: { type: Type.STRING },
            catalogMatch: { type: Type.STRING },
            estimatedGrams: { type: Type.NUMBER },
          },
          required: ["detectedName", "catalogMatch", "estimatedGrams"],
        },
      },
    },
  });

  return JSON.parse(response.text);
}
