import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/errors.js";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: "Not found" });
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, details: err.details });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      details: err.issues
    });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
}
