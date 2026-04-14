import type { Request, Response } from "express";
import Application from "../models/Application.Model";
import Job from "../models/Job.Model";
import type { AuthRequest } from "../types/type";

class ApplicationController {
  async getAll(_req: Request, res: Response) {
    try {
      const applications = await Application.find().populate("jobId").populate("userId").populate("employerId");
      return res.status(200).json({ success: true, data: applications });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async submit(req: AuthRequest, res: Response) {
    try {
      const jobId = req.params.jobId || req.body.jobId;
      if (!jobId || !jobId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ success: false, message: "Invalid job ID format" });
      }

      const job = await Job.findById(jobId);
      if (!job || !job.isActive) return res.status(404).json({ success: false, message: "Job not found or no longer active" });
      if (new Date() > job.deadline) return res.status(400).json({ success: false, message: "Application deadline has passed" });
      if (!job.employerId) return res.status(500).json({ success: false, message: "Job data is corrupted" });

      const userId = req.user!.id;
      const employerId = job.employerId.toString();
      const { name, email, coverLetter } = req.body;

      let resume = "";
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files.resume?.[0]) resume = files.resume[0].path || files.resume[0].filename;
      }

      if (!resume || !name || !email) {
        return res.status(400).json({ success: false, message: "name, email, and resume are required" });
      }

      const existing = await Application.findOne({ jobId, userId });
      if (existing) return res.status(400).json({ success: false, message: "You have already applied for this job" });

      const newApplication = await Application.create({ jobId, userId, employerId, name, email, resume, coverLetter: coverLetter || "" });
      job.applicationCount += 1;
      await job.save();

      return res.status(201).json({ success: true, message: "Application submitted successfully", data: newApplication });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const application = await Application.findById(req.params.id).populate("jobId").populate("userId").populate("employerId");
      if (!application) return res.status(404).json({ success: false, message: "Application not found" });

      const { id, role } = req.user!;
      const isOwner = application.userId.toString() === id;
      const isEmployer = application.employerId.toString() === id;
      if (!isOwner && !isEmployer && role !== "ADMIN") return res.status(403).json({ success: false, message: "Forbidden" });

      return res.status(200).json({ success: true, data: application });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const application = await Application.findById(req.params.id);
      if (!application) return res.status(404).json({ success: false, message: "Application not found" });

      const { id, role } = req.user!;
      if (role !== "ADMIN" && application.employerId.toString() !== id) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      const { status, notes } = req.body;
      const updated = await Application.findByIdAndUpdate(req.params.id, { status, notes, lastUpdated: new Date() }, { new: true, runValidators: true })
        .populate("jobId").populate("userId").populate("employerId");

      return res.status(200).json({ success: true, message: "Application status updated successfully", data: updated });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getByJob(req: AuthRequest, res: Response) {
    try {
      if (req.user!.role === "EMPLOYER") {
        const job = await Job.findById(req.params.jobId);
        if (!job || job.employerId.toString() !== req.user!.id) return res.status(403).json({ success: false, message: "Forbidden" });
      }
      const applications = await Application.find({ jobId: req.params.jobId }).populate("userId").sort({ submissionDate: -1 });
      return res.status(200).json({ success: true, data: applications });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getByUser(req: AuthRequest, res: Response) {
    try {
      if (req.user!.role !== "ADMIN" && req.user!.id !== req.params.userId) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      const applications = await Application.find({ userId: req.params.userId }).populate("jobId").populate("employerId").sort({ submissionDate: -1 });
      return res.status(200).json({ success: true, data: applications });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getByEmployer(req: AuthRequest, res: Response) {
    try {
      if (req.user!.role !== "ADMIN" && req.user!.id !== req.params.employerId) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      const applications = await Application.find({ employerId: req.params.employerId }).populate("jobId").populate("userId").sort({ submissionDate: -1 });
      return res.status(200).json({ success: true, data: applications });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const application = await Application.findByIdAndDelete(req.params.id);
      if (!application) return res.status(404).json({ success: false, message: "Application not found" });

      const job = await Job.findById(application.jobId);
      if (job && job.applicationCount > 0) { job.applicationCount -= 1; await job.save(); }

      return res.status(200).json({ success: true, message: "Application deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export default new ApplicationController();
