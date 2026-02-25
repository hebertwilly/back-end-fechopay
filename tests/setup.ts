process.env.NODE_ENV = "test";

import mongoose from "mongoose";
import { env } from "../src/config/env";

beforeAll(async () => {
  await mongoose.connect(env.mongoUri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});