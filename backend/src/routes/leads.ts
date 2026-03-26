import { Router } from "express";
import { authRequired, requireRole } from "../middleware/auth.js";
import { createLead, deleteLead, listLeads, updateLead } from "../controllers/leadController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authRequired);
router.get("/", asyncHandler(listLeads));
router.post("/", asyncHandler(createLead));
router.patch("/:id", asyncHandler(updateLead));
router.delete("/:id", requireRole(["ADMIN"]), asyncHandler(deleteLead));

export default router;
