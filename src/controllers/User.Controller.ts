import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.Model";
import Application from "../models/Application.Model";
import config from "../config/env.config";
import type { AuthRequest } from "../types/type";
import MailService from "../utils/Mail";

class UserController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, contactPhone, password, role } = req.body;

      if (!name || !email || !contactPhone || !password || !role) {
        return res.status(400).json({ success: false, message: "name, email, contactPhone, password, role are required" });
      }

      if (role === "EMPLOYER") {
        return res.status(400).json({
          success: false,
          message: "Please use /api/employers/register for employer registration",
        });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(400).json({ success: false, message: "User with this email already exists" });
      }

      const avatarUrl = req.file ? req.file.path : undefined;
      const newUser = await User.create({
        name,
        email: normalizedEmail,
        contactPhone,
        password,
        role: role.toUpperCase(),
        avatar: avatarUrl,
      });

      const token = jwt.sign({ id: newUser._id, userType: "user" }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

      // Send welcome email (asynchronous, don't block response)
      MailService.sendWelcomeEmail(newUser.email, newUser.name.split(" ")[0]);

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, avatar: newUser.avatar },
      });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((v: any) => v.message);
        return res.status(400).json({ success: false, message: messages.join(", ") });
      }
      console.error("Error creating user:", error);
      return res.status(500).json({ success: false, message: "User creation failed" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
      if (!user.isActive) {
        return res.status(401).json({ success: false, message: "Account has been suspended" });
      }
      if (user.role !== "CANDIDATE" && user.role !== "ADMIN") {
        return res.status(400).json({ success: false, message: "Please use employer login for employer accounts" });
      }

      const token = jwt.sign({ id: user._id, userType: "user" }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

      return res.status(200).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async logout(_req: Request, res: Response) {
    return res.status(200).json({ success: true, message: "Logout successful" });
  }

  async getById(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      if (req.user!.id !== req.params.id && req.user!.role !== "ADMIN") {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      const { password, role, ...safeBody } = req.body;
      const user = await User.findByIdAndUpdate(req.params.id, safeBody, { new: true, runValidators: true }).select("-password");
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      return res.status(200).json({ success: true, message: "User updated successfully", data: user });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async toggleStatus(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      user.isActive = !user.isActive;
      await user.save();
      return res.status(200).json({
        success: true,
        message: `User account ${user.isActive ? "activated" : "suspended"} successfully`,
        data: { isActive: user.isActive },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async changePassword(req: AuthRequest, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user!.id).select("+password");
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) return res.status(400).json({ success: false, message: "Current password is incorrect" });

      user.password = newPassword;
      await user.save();
      return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const [appliedJobs, shortlisted] = await Promise.all([
        Application.countDocuments({ userId }),
        Application.countDocuments({ userId, status: "SHORTLISTED" })
      ]);

      return res.status(200).json({
        success: true,
        data: {
          appliedJobs,
          shortlisted,
          savedJobs: 0 // Placeholder for future saved jobs feature
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export default new UserController();
