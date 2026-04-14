import { Router } from "express";
import { protect } from "../middleware/auth.Middleware";
import { authorize } from "../middleware/authorize";
import { documentUpload } from "../middleware/documentUpload.middleware";
import ApplicationController from "../controllers/Application.Controller";

const router = Router();

router.get("/", protect, authorize("ADMIN"), ApplicationController.getAll.bind(ApplicationController));
router.post("/:jobId", protect, authorize("CANDIDATE"),
  documentUpload.fields([{ name: "resume", maxCount: 1 }, { name: "coverLetter", maxCount: 1 }]),
  ApplicationController.submit.bind(ApplicationController)
);
router.get("/job/:jobId", protect, authorize("EMPLOYER", "ADMIN"), ApplicationController.getByJob.bind(ApplicationController));
router.get("/user/:userId", protect, ApplicationController.getByUser.bind(ApplicationController));
router.get("/employer/:employerId", protect, authorize("EMPLOYER", "ADMIN"), ApplicationController.getByEmployer.bind(ApplicationController));
router.get("/:id", protect, ApplicationController.getById.bind(ApplicationController));
router.put("/:id/status", protect, authorize("EMPLOYER", "ADMIN"), ApplicationController.updateStatus.bind(ApplicationController));
router.delete("/:id", protect, authorize("ADMIN"), ApplicationController.delete.bind(ApplicationController));

export default router;
