import { Request, Response } from "express";
import { getDashboardOverview } from "../services/dashboardService.js";

export async function dashboardOverview(req: Request, res: Response) {
  const data = await getDashboardOverview();
  res.json(data);
}
