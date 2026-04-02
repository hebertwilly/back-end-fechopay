import { Router } from "express";
import { authController } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
const authRoutes = Router();

authRoutes.post("/login", authController.login);
authRoutes.get("/me", authMiddleware, authController.me);
authRoutes.post("/logout", authController.logout);

export { authRoutes };