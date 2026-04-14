import { Router } from "express";
import { protect } from "../middleware/auth.Middleware";
import { authorize } from "../middleware/authorize";
import AdminController from "../controllers/adminController";

const router = Router();

router.use(protect);
router.use(authorize("ADMIN"));

router.get("/stats", AdminController.getStats.bind(AdminController));
router.get("/users", AdminController.getUsers.bind(AdminController));
router.get("/employers", AdminController.getEmployers.bind(AdminController));
router.get("/jobs", AdminController.getJobs.bind(AdminController));
router.get("/applications", AdminController.getApplications.bind(AdminController));
router.delete("/users/:id", AdminController.deleteUser.bind(AdminController));
router.delete("/employers/:id", AdminController.deleteEmployer.bind(AdminController));
router.delete("/applications/:id", AdminController.deleteApplication.bind(AdminController));

router.get("/categories", AdminController.getCategories.bind(AdminController));
router.post("/categories", AdminController.createCategory.bind(AdminController));
router.patch("/categories", AdminController.deleteAllCategories.bind(AdminController));
router.get("/categories/:id", AdminController.getCategoryById.bind(AdminController));
router.put("/categories/:id", AdminController.updateCategory.bind(AdminController));
router.delete("/categories/:id", AdminController.deleteCategory.bind(AdminController));

export default router;
