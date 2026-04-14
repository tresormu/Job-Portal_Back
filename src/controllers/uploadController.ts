import type { Response } from "express";
import User from "../models/User.Model";
import type { AuthRequest } from "../types/type";

class UploadController {
  async uploadProfilePicture(req: AuthRequest, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });

      const user = await User.findByIdAndUpdate(userId, { avatar: req.file.path }, { new: true }).select("-password");
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      return res.status(200).json({ success: true, message: "Profile picture uploaded successfully", data: { profileUrl: user.avatar } });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Upload failed" });
    }
  }
}

export default new UploadController();
