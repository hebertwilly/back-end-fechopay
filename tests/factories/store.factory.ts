import bcrypt from "bcrypt";
import { Store } from "../../src/modules/store/store.model";

type CreateTestStoreInput = {
  name?: string;
  slug?: string;
  email?: string;
  password?: string;
  whatsappNumber?: string;
  plan?: string;
};

export async function createTestStore(data: CreateTestStoreInput = {}) {
  const plainPassword = data.password ?? "123456";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const store = await Store.create({
    name: data.name ?? "Michelle Miler jeans",
    slug: data.slug ?? "michelle-miller",
    email: data.email ?? "michellemiller@gmail.com",
    password: hashedPassword,
    whatsappNumber: data.whatsappNumber ?? "14997947140",
    plan: data.plan ?? "free",
  });

  return {
    store,
    plainPassword,
  };
}