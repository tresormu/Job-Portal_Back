import { Router } from "express";
import { protect } from "../middleware/auth.Middleware";
import { authorize } from "../middleware/authorize";
import JobController from "../controllers/Job.Controller";

const router = Router();

router.get("/all", JobController.getAll.bind(JobController));
router.get("/categories", JobController.getCategories.bind(JobController));
router.get("/search", JobController.search.bind(JobController));
router.get("/employer/:employerId", JobController.getByEmployer.bind(JobController));
router.post("/", protect, authorize("EMPLOYER"), JobController.create.bind(JobController));
router.put("/:id", protect, authorize("EMPLOYER"), JobController.update.bind(JobController));
router.delete("/:id", protect, authorize("EMPLOYER", "ADMIN"), JobController.delete.bind(JobController));
router.get("/:id", JobController.getById.bind(JobController));

export default router;
