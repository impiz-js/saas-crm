import { Router } from "express";
import { authRequired, requireRole } from "../middleware/auth.js";
import { createClient, deleteClient, listClients, updateClient } from "../controllers/clientController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authRequired);
router.get("/", asyncHandler(listClients));
router.post("/", asyncHandler(createClient));
router.patch("/:id", asyncHandler(updateClient));
router.delete("/:id", requireRole(["ADMIN"]), asyncHandler(deleteClient));

export default router;
