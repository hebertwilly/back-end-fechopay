import { Router } from "express";
import { storeController } from "./store.controller";

const router = Router();

router.post("/", storeController.create);
router.patch("/:id", storeController.update);
router.patch("/:id/password", storeController.updatePassword);

export default router;