import { Store, StoreDocument } from "./store.model";

export interface CreateStoreDTO {
  name: string;
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

    const slug = await this.generateSlug(data.name);

    const store = await Store.create({
      ...data,
      slug,
    });

    return store;
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