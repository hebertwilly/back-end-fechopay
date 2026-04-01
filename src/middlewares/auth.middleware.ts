import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

type AuthTokenPayload = {
  sub: string;
  email: string;
  slug: string;
  iat?: number;
  exp?: number;
};

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({
        message: "Não autenticado",
      });
      return;
    }

    const decoded = jwt.verify(token, env.jwtSecret) as AuthTokenPayload;

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      slug: decoded.slug,
    };

    next();
  } catch {
    res.status(401).json({
      message: "Token inválido ou expirado",
    });
  }
}