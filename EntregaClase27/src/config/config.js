import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program.option("--mode <modo>", "variable de ambiente");
program.parse();

const environment = program.opts().mode || "development"; // valor predeterminado
dotenv.config({
  path: `./.env.${environment}`,
});

const {
  MONGO_URL = "default_mongo_url",
  ADMIN_EMAIL = "default_admin_email",
  ADMIN_PASSWORD = "default_admin_password",
} = process.env;

const configs = {
  port: process.env.PORT || 8080,
  mongoUrl: MONGO_URL,
  adminEmail: ADMIN_EMAIL,
  adminPassword: ADMIN_PASSWORD,
};

export default configs;
