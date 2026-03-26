import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { config } from "../config.js";

interface JwtPayload {
  sub: string;
  role: Role;
  email: string;
  name: string;
}

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.replace("Bearer ", "").trim();
  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
      name: payload.name
    };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireRole(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };
}
