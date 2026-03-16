import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger";

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error({
    message: error.message,
    stack: error.stack,
    path: req.path,
  });

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Erro de validação",
      errors: error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    });
  }

  return res.status(500).json({
    success: false,
    message: error.message || "Erro interno do servidor",
  });
}