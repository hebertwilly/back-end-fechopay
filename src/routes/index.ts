import { Router } from "express";
import storeRoutes from "../modules/store/store.routes";
import { authRoutes } from "../modules/auth/auth.routes";

export const routes = Router();

routes.get("/", (_, res) => {
  res.json({ message: "API running" });
});

routes.use("/stores", storeRoutes);
routes.use("/auth", authRoutes);