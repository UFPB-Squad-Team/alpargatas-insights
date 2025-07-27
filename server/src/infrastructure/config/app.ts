import { getEnv } from "../../shared/utils/getEnv";

const appConfig = () => ({
  PORT: getEnv("PORT", "5000"),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  MONGO_URI: getEnv("MONGO_URI"),
  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN"),
});

export const config = appConfig();
