import type { Request, Response } from "express";
import User from "../models/User.Model";
import Employer from "../models/Employer.Model";
import Job from "../models/Job.Model";
import Application from "../models/Application.Model";
import Category from "../models/Category.Model";
import { getPaginationParams, createPaginationResult } from "../utils/pagination";

class AdminController {
  async getUsers(req: Request, res: Response) {
    try {
      const { page, limit, sortBy, sortOrder } = getPaginationParams(req.query);
      const skip = (page - 1) * limit;
      const sort: any = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
      const [users, total] = await Promise.all([User.find().select("-password").sort(sort).skip(skip).limit(limit), User.countDocuments()]);
      return res.status(200).json({ success: true, ...createPaginationResult(users, total, page, limit) });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getEmployers(req: Request, res: Response) {
    try {
      const { page, limit, sortBy, sortOrder } = getPaginationParams(req.query);
      const skip = (page - 1) * limit;
      const sort: any = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
      const [employers, total] = await Promise.all([Employer.find().select("-password").sort(sort).skip(skip).limit(limit), Employer.countDocuments()]);
      return res.status(200).json({ success: true, ...createPaginationResult(employers, total, page, limit) });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getJobs(req: Request, res: Response) {
    try {
      const { page, limit, sortBy, sortOrder } = getPaginationParams(req.query);
      const skip = (page - 1) * limit;
      const sort: any = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
      const [jobs, total] = await Promise.all([Job.find().sort(sort).skip(skip).limit(limit), Job.countDocuments()]);
      return res.status(200).json({ success: true, ...createPaginationResult(jobs, total, page, limit) });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getApplications(req: Request, res: Response) {
    try {
      const { page, limit, sortBy, sortOrder } = getPaginationParams(req.query);
      const skip = (page - 1) * limit;
      const sort: any = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
      const [applications, total] = await Promise.all([Application.find().sort(sort).skip(skip).limit(limit), Application.countDocuments()]);
      return res.status(200).json({ success: true, ...createPaginationResult(applications, total, page, limit) });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getStats(_req: Request, res: Response) {
    try {
      const [totalUsers, totalEmployers, totalApplicants, totalJobs, totalApplications] = await Promise.all([
        User.countDocuments(), Employer.countDocuments(), User.countDocuments({ role: "CANDIDATE" }), Job.countDocuments(), Application.countDocuments(),
      ]);
      return res.status(200).json({ success: true, data: { totalUsers, totalEmployers, totalApplicants, totalJobs, totalApplications } });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async deleteEmployer(req: Request, res: Response) {
    try {
      const employer = await Employer.findByIdAndDelete(req.params.id);
      if (!employer) return res.status(404).json({ success: false, message: "Employer not found" });
      return res.status(200).json({ success: true, message: "Employer deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async deleteApplication(req: Request, res: Response) {
    try {
      const application = await Application.findByIdAndDelete(req.params.id);
      if (!application) return res.status(404).json({ success: false, message: "Application not found" });
      return res.status(200).json({ success: true, message: "Application deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getCategories(_req: Request, res: Response) {
    try {
      const categories = await Category.find({});
      return res.status(200).json({ success: true, categories });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getCategoryById(req: Request, res: Response) {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) return res.status(404).json({ success: false, message: "Category not found" });
      return res.status(200).json({ success: true, category });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async createCategory(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const category = await Category.create({ name, description });
      return res.status(201).json({ success: true, category });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!category) return res.status(404).json({ success: false, message: "Category not found" });
      return res.status(200).json({ success: true, message: "Category updated successfully", category });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) return res.status(404).json({ success: false, message: "Category not found" });
      return res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async deleteAllCategories(_req: Request, res: Response) {
    try {
      const result = await Category.deleteMany({});
      return res.status(200).json({ success: true, message: `${result.deletedCount} categories deleted successfully` });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export default new AdminController();
