import express from "express";
import {
       registerUser,
       loginUser,
       getProfile,
       updateUser,
       deleteUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/update", protect, updateUser);
router.delete("/delete", protect, deleteUser);

export default router;
