import { Router } from "express";
import { authRequired, requireRole } from "../middleware/auth.js";
import { createDeal, deleteDeal, listDeals, updateDeal } from "../controllers/dealController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authRequired);
router.get("/", asyncHandler(listDeals));
router.post("/", asyncHandler(createDeal));
router.patch("/:id", asyncHandler(updateDeal));
router.delete("/:id", requireRole(["ADMIN"]), asyncHandler(deleteDeal));

export default router;
