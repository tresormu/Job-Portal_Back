import { Router } from "express";
import { protect } from "../middleware/auth.Middleware";
import { authorize } from "../middleware/authorize";
import EmployerController from "../controllers/Employer.Controller";

const router = Router();

router.post("/register", EmployerController.register.bind(EmployerController));
router.post("/login", EmployerController.login.bind(EmployerController));
router.get("/all", EmployerController.getAll.bind(EmployerController));
router.get("/top-hiring", EmployerController.getTopHiring.bind(EmployerController));
router.get("/:id", EmployerController.getById.bind(EmployerController));

router.post("/", protect, authorize("ADMIN"), EmployerController.create.bind(EmployerController));
router.patch("/:id/verify", protect, authorize("ADMIN"), EmployerController.verify.bind(EmployerController));
router.delete("/:id", protect, authorize("ADMIN"), EmployerController.delete.bind(EmployerController));
router.put("/:id", protect, authorize("EMPLOYER", "ADMIN"), EmployerController.update.bind(EmployerController));

export default router;
