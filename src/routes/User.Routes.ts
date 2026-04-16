import { Router } from "express";
import { protect } from "../middleware/auth.Middleware";
import { authorize } from "../middleware/authorize";
import { profileUpload } from "../middleware/profileUpload.middleware";
import UserController from "../controllers/User.Controller";

const router = Router();

router.post("/register", profileUpload.single("profile"), UserController.register.bind(UserController));
router.post("/login", UserController.login.bind(UserController));
router.post("/logout", protect, UserController.logout.bind(UserController));
router.post("/change-password", protect, UserController.changePassword.bind(UserController));
router.get("/stats", protect, UserController.getStats.bind(UserController));
router.get("/:id", protect, UserController.getById.bind(UserController));
router.put("/:id", protect, UserController.update.bind(UserController));
router.delete("/:id", protect, authorize("ADMIN"), UserController.delete.bind(UserController));
router.patch("/:id/status", protect, authorize("ADMIN"), UserController.toggleStatus.bind(UserController));

export default router;
