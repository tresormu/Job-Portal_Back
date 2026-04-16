import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Employer from "../models/Employer.Model";
import Job from "../models/Job.Model";
import Application from "../models/Application.Model";
import config from "../config/env.config";
import type { AuthRequest } from "../types/type";
import MailService from "../utils/Mail";

class EmployerController {
  async getAll(_req: Request, res: Response) {
    try {
      const employers = await Employer.find().select("-password");
      return res.status(200).json({ success: true, data: employers });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, phone, companyName } = req.body;
      if (!companyName || !email || !password || !phone) {
        return res.status(400).json({ success: false, message: "companyName, email, password, phone are required" });
      }

      const existing = await Employer.findOne({ email: email.toLowerCase().trim() });
      if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

      const employer = await Employer.create({ email: email.toLowerCase().trim(), password, phone, companyName, isVerified: false });

      const token = jwt.sign({ id: employer._id, userType: "employer" }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

      // Send welcome email
      MailService.sendWelcomeEmail(employer.email, employer.companyName);

      return res.status(201).json({
        success: true,
        token,
        user: { id: employer._id, name: employer.companyName, email: employer.email, role: "EMPLOYER", companyName: employer.companyName },
      });
    } catch (error: any) {
      if (error.name === "ValidationError") return res.status(400).json({ success: false, message: error.message });
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const employer = await Employer.findOne({ email: email.toLowerCase().trim() }).select("+password");

      if (!employer || !(await bcrypt.compare(password, employer.password))) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }
      if (!employer.isActive) {
        return res.status(401).json({ success: false, message: "Account has been suspended" });
      }

      const token = jwt.sign({ id: employer._id, userType: "employer" }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

      return res.status(200).json({
        success: true,
        token,
        user: { id: employer._id, name: employer.companyName, email: employer.email, role: "EMPLOYER", companyName: employer.companyName, isVerified: employer.isVerified },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const employer = await Employer.findById(req.params.id).select("-password");
      if (!employer) return res.status(404).json({ success: false, message: "Employer not found" });
      return res.status(200).json({ success: true, data: employer });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      if (req.user!.id !== req.params.id && req.user!.role !== "ADMIN") {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      const { password, isVerified, ...safeBody } = req.body;
      const employer = await Employer.findByIdAndUpdate(req.params.id, safeBody, { new: true, runValidators: true }).select("-password");
      if (!employer) return res.status(404).json({ success: false, message: "Employer not found" });
      return res.status(200).json({ success: true, data: employer });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const employer = await Employer.findByIdAndDelete(req.params.id);
      if (!employer) return res.status(404).json({ success: false, message: "Employer not found" });
      return res.status(200).json({ success: true, message: "Employer deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const employer = await Employer.findByIdAndUpdate(req.params.id, { isVerified: req.body.isVerified }, { new: true }).select("-password");
      if (!employer) return res.status(404).json({ success: false, message: "Employer not found" });
      return res.status(200).json({ success: true, data: employer });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const employer = await Employer.create(req.body);
      return res.status(201).json({ success: true, data: employer });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message || "Failed to create employer" });
    }
  }

  async getTopHiring(_req: Request, res: Response) {
    try {
      const employers = await Employer.find({ isVerified: true }).select("-password");
      const withCounts = await Promise.all(
        employers.map(async (employer) => {
          const jobCount = await Job.countDocuments({ employerId: new mongoose.Types.ObjectId(employer._id.toString()), isActive: true });
          return { ...employer.toObject(), jobCount };
        })
      );
      const top = withCounts.filter((e) => e.jobCount > 0).sort((a, b) => b.jobCount - a.jobCount).slice(0, 10);
      return res.status(200).json({ success: true, data: top });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getStats(req: AuthRequest, res: Response) {
    try {
      const employerId = new mongoose.Types.ObjectId(req.user!.id);
      
      const [activeJobs, totalApplicants, shortlistedCount, jobs] = await Promise.all([
        Job.countDocuments({ employerId, isActive: true }),
        Application.countDocuments({ employerId }),
        Application.countDocuments({ employerId, status: "SHORTLISTED" }),
        Job.find({ employerId }).select("views")
      ]);

      const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);

      return res.status(200).json({
        success: true,
        data: {
          activeJobs,
          totalApplicants,
          totalViews,
          shortlistedCount
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export default new EmployerController();
