  import type { Request, Response } from "express";
import mongoose from "mongoose";
import Job from "../models/Job.Model";
import type { AuthRequest } from "../types/type";

class JobController {
  async getAll(_req: Request, res: Response) {
    try {
      const jobs = await Job.find({ isActive: true });
      return res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { title, description, company, requirements, responsibilities, category, jobType, type, location, salary, experience, education, tags, deadline, image } = req.body;
      const finalJobType = jobType || type;

      if (!title || !description || !company || !requirements || !responsibilities || !category || !finalJobType || !location || !deadline) {
        return res.status(400).json({ success: false, message: "All required fields are needed" });
      }

      const newJob = await Job.create({
        title, description, company, requirements, responsibilities, category,
        jobType: finalJobType, location, salary, experience, education, tags, deadline,
        employerId: req.user!.id, image,
      });

      return res.status(201).json({ success: true, message: "Job created successfully", data: newJob });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ success: false, message: "Job not found" });
      job.views += 1;
      await job.save({ validateBeforeSave: false });
      return res.status(200).json({ success: true, data: job });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ success: false, message: "Job not found" });
      if (job.employerId.toString() !== req.user!.id) return res.status(403).json({ success: false, message: "Forbidden" });

      const { employerId, ...safeBody } = req.body;
      const updated = await Job.findByIdAndUpdate(req.params.id, safeBody, { new: true, runValidators: true });
      return res.status(200).json({ success: true, message: "Job updated successfully", data: updated });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ success: false, message: "Job not found" });
      if (req.user!.role !== "ADMIN" && job.employerId.toString() !== req.user!.id) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      await job.deleteOne();
      return res.status(200).json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getByEmployer(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.employerId) ? req.params.employerId[0] : req.params.employerId;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid employer ID" });
      const jobs = await Job.find({ employerId: new mongoose.Types.ObjectId(id) });
      return res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getCategories(_req: Request, res: Response) {
    try {
      const result = await Job.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $project: { _id: 0, name: "$_id", count: 1 } },
        { $sort: { name: 1 } },
      ]);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const { keyword, category, location, jobType } = req.query;
      const query: any = { isActive: true };
      if (keyword) query.$or = [{ title: { $regex: keyword, $options: "i" } }, { description: { $regex: keyword, $options: "i" } }];
      if (category) query.category = category;
      if (location) query.location = { $regex: location, $options: "i" };
      if (jobType) query.jobType = jobType;
      const jobs = await Job.find(query);
      return res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export default new JobController();
