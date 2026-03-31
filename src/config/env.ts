import dotenv from "dotenv";
import ms, { type StringValue } from "ms";

const nodeEnv = process.env.NODE_ENV ?? "development";

const envFile =
  nodeEnv === "test"
    ? ".env.test"
    : nodeEnv === "production"
    ? ".env.prod"
    : ".env.dev";

dotenv.config({ path: envFile });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Variável de ambiente ${name} não definida (${envFile})`);
  }
  return value;
}

const jwtExpiresIn = requireEnv("JWT_EXPIRES_IN") as StringValue;
const jwtCookieMaxAge = ms(jwtExpiresIn);

export const env = {
  nodeEnv,
  port: Number(process.env.PORT) || 3000,
  mongoUri: requireEnv("MONGO_URI"),
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiresIn,
  jwtCookieMaxAge,
};