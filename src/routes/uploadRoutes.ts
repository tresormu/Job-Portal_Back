import { Router } from "express";
import { protect } from "../middleware/auth.Middleware";
import { profileUpload } from "../middleware/profileUpload.middleware";
import UploadController from "../controllers/uploadController";

const router = Router();

router.post("/profile", protect, profileUpload.single("profile"), UploadController.uploadProfilePicture.bind(UploadController));

export default router;
