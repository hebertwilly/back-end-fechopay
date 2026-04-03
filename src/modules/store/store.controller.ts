import { Request, Response, NextFunction } from "express";
import { storeService } from "./store.service";
import { createStoreSchema, updateStoreSchema, updatePasswordSchema } from "./store.schema";
import { requireUser } from "../../utils/require-user";
class StoreController {

  async create(req: Request, res: Response, next: NextFunction) {
    try {

      const validatedData = createStoreSchema.parse(req.body);
      
      const store = await storeService.createStore(validatedData);
      const storeObject = store.toObject();
      delete storeObject.password;

      res.status(201).json({
        success: true,
        data: storeObject,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction){
    try {

      const user = requireUser(req);


      const validatedData = updateStoreSchema.parse(req.body);

      const store = await storeService.updateStore(user.id, validatedData);

      res.status(200).json({
        success: true,
        data: store,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePassword (req: Request, res: Response, next: NextFunction){
    try{
      
      const user = requireUser(req);
      
      const validatedData = updatePasswordSchema.parse(req.body);

      await storeService.updatePassword(user.id, validatedData);

      res.status(200).json({
        success: true,
        message: "Senha atualizada com sucesso"
      });
    }catch(error){
      next(error);
    }
  }
}

export const storeController = new StoreController();