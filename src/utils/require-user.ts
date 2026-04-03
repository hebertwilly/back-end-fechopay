import { Request } from "express";
import { AppError } from "../errors/AppError";

type AuthenticatedUser = {
  id: string;
  email: string;
  slug: string;
};

export function requireUser(req: Request): AuthenticatedUser {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  return req.user;
}