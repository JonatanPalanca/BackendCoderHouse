import dotenv from "dotenv";
import { Command } from "commander";
import logger from "../utils/logger.js";

const program = new Command();

program.option("--mode <modo>", "variable de ambiente", "DEVELOPMENT");
program.parse();

const environment = program.opts().mode;

try {
  dotenv.config({
    path:
      environment === "DEVELOPMENT"
        ? "./.env.development"
        : "./.env.production",
  });
} catch (error) {
  logger.error("Error loading .env file:", error);
  process.exit(1);
}

const configs = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  mailAdmin: process.env.MAIL_ADMIN,
  passAdmin: process.env.PASS_ADMIN,
  privateKeyJWT: process.env.PRIVATE_KEY_JWT,
  gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  persistence: process.env.PERSISTENCE,
  gitHubcallbackURL: process.env.CALLBACK_URL,
};

export default configs;
