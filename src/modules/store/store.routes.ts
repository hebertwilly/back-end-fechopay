import { Router } from "express";
import { storeController } from "./store.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", storeController.create);
router.patch("/me",authMiddleware, storeController.update);
router.patch("/me/password",authMiddleware, storeController.updatePassword);

export default router;