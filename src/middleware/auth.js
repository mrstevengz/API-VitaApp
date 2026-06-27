import jwt from "jsonwebtoken";
import { ApiError } from "./error.js";

export function authenticate(req, res, next) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, "Missing token"));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") return next(new ApiError(403, "Admin only"));
  next();
}
