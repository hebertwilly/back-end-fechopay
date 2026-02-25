import { Request, Response, NextFunction } from "express";
import { storeService } from "./store.service";

class StoreController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const store = await storeService.createStore(req.body);

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