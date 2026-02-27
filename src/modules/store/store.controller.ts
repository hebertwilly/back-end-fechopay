import { Request, Response, NextFunction } from "express";
import { storeService } from "./store.service";
import { createStoreSchema } from "./store.schema";

class StoreController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {

      const validatedData = createStoreSchema.parse(req.body);
      
      const store = await storeService.createStore(validatedData);

      return res.status(201).json({
        success: true,
        data: store,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const storeController = new StoreController();