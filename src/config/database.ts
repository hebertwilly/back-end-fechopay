import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

export async function connectDatabase() {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info(`MongoDB connected [${env.nodeEnv}]`);
  } catch (error) {
    logger.error(error, "MongoDB connection error");

    if (env.nodeEnv !== "test") {
      process.exit(1);
    }

    throw error; // em test deixa o Jest capturar
  }
}