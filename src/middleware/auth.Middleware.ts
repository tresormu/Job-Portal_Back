import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env.config";
import type { AuthRequest, JwtPayload } from "../types/type";
import Employer from "../models/Employer.Model";
import User from "../models/User.Model";

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format" });

    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

    if (decoded.userType === "employer") {
      const employer = await Employer.findById(decoded.id).select("-password");
      if (!employer) return res.status(401).json({ error: "User not found" });
      req.user = { id: String(employer._id), role: "EMPLOYER" };
    } else {
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ error: "User not found" });
      req.user = { id: String(user._id), role: user.role };
    }

    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
