import { Router } from "express";
import { authController } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
const authRoutes = Router();

authRoutes.post("/login", authController.login.bind(authController));
authRoutes.get("/me", authMiddleware, authController.me.bind(authController));

export { authRoutes };