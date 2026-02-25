import { Store, StoreDocument } from "./store.model";

export interface CreateStoreDTO {
  name: string;
  slug: string;
  email: string;
  password: string;
  whatsappNumber: string;
}

class StoreService {
  async createStore(data: CreateStoreDTO): Promise<StoreDocument> {
    const emailExists = await Store.findOne({ email: data.email });
    if (emailExists) {
      throw new Error("Email já cadastrado");
    }

    const slugExists = await Store.findOne({ slug: data.slug });
    if (slugExists) {
      throw new Error("Slug já está em uso");
    }

    const store = await Store.create(data);

    return store;
  }

}

export const storeService = new StoreService();