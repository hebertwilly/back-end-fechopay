import { Router } from "express";
import { storeController } from "./store.controller";

const router = Router();

router.post("/", storeController.create);
router.put("/:id", storeController.update);

export default router;