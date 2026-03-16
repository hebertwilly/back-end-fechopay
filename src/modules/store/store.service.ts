import mongoose from "mongoose";
import { Store, StoreDocument } from "./store.model";

export interface CreateStoreDTO {
  name: string;
  email: string;
  password: string;
  whatsappNumber: string;
}

export interface UpdateStoreDTO {
  name?: string;
  email?: string;
  password?: string;
  whatsappNumber?: string;
}
class StoreService {
  async createStore(data: CreateStoreDTO): Promise<StoreDocument> {
    
    const emailExists = await Store.findOne({ email: data.email });
    
    if (emailExists) {
      throw new Error("Email já cadastrado");
    }

    const slug = await this.generateSlug(data.name);

    const store = await Store.create({
      ...data,
      slug,
    });

    return store;
  }

  async updateStore(id: string, data: UpdateStoreDTO): Promise<StoreDocument>{
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Formato de ID inválido");
    }

    if (data.email) {
      const emailAlreadyExists = await Store.findOne({
        email: data.email,
        _id: { $ne: id },
      });

      if (emailAlreadyExists) {
        throw new Error("Email já cadastrado");
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
      throw new Error("Loja não encontrada");
    }

    return storeUpdate;
  }

  private async generateSlug (name: String): Promise<string> {
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