import bcrypt from "bcrypt";
import express from "express";
import { ApiError } from "../middleware/error.js";
import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

//Ruta de registar, no usa tokens solo encriptacion
router.post("/register", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required fields");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password length must be at least than 8 digits");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
    },
  });
  const { passwordHash: _, ...safeUser } = user;

  res.status(201).json(safeUser);
});

export default router;

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" },
  );

  res.json({ token });
});
