import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCompany, upsertCompany } from "../controllers/companyController.js";

const router = Router();

router.use(authRequired);
router.get("/", asyncHandler(getCompany));
router.put("/", asyncHandler(upsertCompany));

export default router;
