import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getOnboardingStep2, upsertOnboardingStep2 } from "../controllers/onboardingController.js";

const router = Router();

router.use(authRequired);
router.get("/step2", asyncHandler(getOnboardingStep2));
router.put("/step2", asyncHandler(upsertOnboardingStep2));

export default router;
