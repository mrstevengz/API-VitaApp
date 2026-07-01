import express from "express";
import upload from "../middleware/upload.js";
import { analyze } from "../controllers/imageController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate);

router.post("/", upload.single("image"), analyze);
export default router;
