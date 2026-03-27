import { Router } from "express";
import authRoutes from "./auth.js";
import clientRoutes from "./clients.js";
import leadRoutes from "./leads.js";
import dealRoutes from "./deals.js";
import dashboardRoutes from "./dashboard.js";
import onboardingRoutes from "./onboarding.js";
import companyRoutes from "./company.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/clients", clientRoutes);
router.use("/leads", leadRoutes);
router.use("/deals", dealRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/onboarding", onboardingRoutes);
router.use("/company", companyRoutes);

export default router;
