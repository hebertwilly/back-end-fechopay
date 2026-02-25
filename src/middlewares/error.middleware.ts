import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  return res.status(500).json({
    error: true,
    message: err.message || "Erro interno do servidor",
  });
}