import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { Store, StoreDocument } from "./store.model";
import { CreateStoreDTO, UpdateStoreDTO, UpdatePasswordDTO } from "./store.schema";
import { AppError } from "../../errors/AppError";
class StoreService {
  async createStore(data: CreateStoreDTO): Promise<StoreDocument> {
    
    const emailExists = await Store.findOne({ email: data.email });
    
    if (emailExists) {
      throw new AppError("Email já cadastrado", 409);
    }

    const slug = await this.generateSlug(data.name);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const store = await Store.create({
      ...data,
      slug,
      password: hashedPassword,
    });
    
    return store;
  }

  async updateStore(id: string, data: UpdateStoreDTO): Promise<StoreDocument>{
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Formato de ID inválido", 400);
    }

    if (data.email) {
      const emailAlreadyExists = await Store.findOne({
        email: data.email,
        _id: { $ne: id },
      });

      if (emailAlreadyExists) {
        throw new AppError("Email já cadastrado", 409);
      }
    }

    const storeUpdate = await Store.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!storeUpdate) {
      throw new AppError("Loja não encontrada", 404);
    }

    return storeUpdate;
  }

  async updatePassword(id: string, data: UpdatePasswordDTO): Promise<void>{
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Formato de ID inválido", 400);
    }

    const store = await Store.findById(id).select("+password");

    if(!store){
      throw new AppError("Loja não encontrada", 404);
    }
    
    const confirmPassword = await bcrypt.compare(data.currentPassword, store.password);

    if(!confirmPassword){
      throw new AppError("Senha Atual invalida", 401);
    }

    const samePassword = await bcrypt.compare(data.newPassword, store.password);

    if (samePassword) {
      throw new AppError("A nova senha não pode ser igual à senha atual", 401);
    }

    store.password = await bcrypt.hash(data.newPassword, 10);
    await store.save();
  }

  private async generateSlug (name: string): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    let slug = baseSlug;
    let counter = 1;

    
    while (await Store.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}

export const storeService = new StoreService();