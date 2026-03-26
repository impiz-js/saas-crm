import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { dashboardOverview } from "../controllers/dashboardController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authRequired);
router.get("/overview", asyncHandler(dashboardOverview));

export default router;
