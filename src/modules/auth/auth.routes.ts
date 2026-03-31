import { Router } from "express";
import { authController } from "./auth.controller";

const authRoutes = Router();

authRoutes.post("/login", authController.login.bind(authController));

export { authRoutes };