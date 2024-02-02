import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program.option("--mode <modo>", "variable de ambiente", "DEVELOPMENT");
program.parse();

export const environment = program.opts().mode;

dotenv.config({
  path:
    environment === "DEVELOPMENT" ? "./.env.development" : "./.env.production",
});

const configs = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  mailAdmin: process.env.MAIL_ADMIN,
  passAdmin: process.env.PASS_ADMIN,
  privateKeyJWT: process.env.PRIVATE_KEY_JWT,
  gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  persistence: process.env.PERSISTENCE,
  userNodemailer: process.env.USER_NODEMAILER,
  passwordNodemailer: process.env.PASSWORD_NODEMAILER,
  twilio_account_SID: process.env.TWILIO_ACCOUNT_SID,
  twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
  twilio_number: process.env.TWILIO_NUMBER,
};

export default configs;
