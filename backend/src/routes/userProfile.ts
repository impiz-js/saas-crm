import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getProfile, updateProfile, changePassword } from "../controllers/userProfileController.js";

const router = Router();

router.use(authRequired);
router.get("/", asyncHandler(getProfile));
router.put("/", asyncHandler(updateProfile));
router.post("/change-password", asyncHandler(changePassword));

export default router;
