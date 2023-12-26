import dotenv from "dotenv";
import { Command } from "commander";
import mongoose from "mongoose";

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
  PERSISTENCE = "MONGO", // Valor por defecto
} = process.env;

const configs = {
  port: process.env.PORT || 8080,
  mongoUrl: PERSISTENCE === "MONGO" ? MONGO_URL : "default_mongo_url", // Usa MONGO_URL si PERSISTENCE es "MONGO", de lo contrario, usa el valor predeterminado
  adminEmail: ADMIN_EMAIL,
  adminPassword: ADMIN_PASSWORD,
  persistence: PERSISTENCE,
};

await mongoose.connect(configs.mongoUrl);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

export default configs;
