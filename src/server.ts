import { app } from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";
import { logger } from "./config/logger";

async function bootstrap() {
  
  await connectDatabase();
  app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
  });
}

bootstrap();