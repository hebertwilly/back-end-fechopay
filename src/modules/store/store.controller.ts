import { Request, Response, NextFunction } from "express";
import { storeService } from "./store.service";
import { createStoreSchema, updateStoreSchema } from "./store.schema";
interface Params {
  id: string;
}
class StoreController {

  async create(req: Request, res: Response, next: NextFunction) {
    try {

      const validatedData = createStoreSchema.parse(req.body);
      
      const store = await storeService.createStore(validatedData);
      const storeObject = store.toObject();
      delete storeObject.password;

      return res.status(201).json({
        success: true,
        data: storeObject,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request<Params>, res: Response, next: NextFunction){
    try {
      const validatedData = updateStoreSchema.parse(req.body);

      const { id } = req.params;

      const store = await storeService.updateStore(id, validatedData);

      return res.status(200).json({
        success: true,
        data: store,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const storeController = new StoreController();