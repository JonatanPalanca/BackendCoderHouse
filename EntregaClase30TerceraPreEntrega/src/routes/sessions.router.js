import { Router } from "express";
import sessionController from "../controllers/sessions.controller.js";

const router = Router();

router.post(
  "/register",
  sessionController.register,
  sessionController.registerCallback
);
router.get("/fail-register", sessionController.failRegister);
router.post("/login", sessionController.login, sessionController.loginCallback);
router.get("/fail-login", sessionController.failLogin);
router.get("/logout", sessionController.logout);
router.get("/github", sessionController.github);
router.get(
  "/github-callback",
  sessionController.githubCallbackFail,
  sessionController.githubCallback
);
router.get("/user", sessionController.getCurrentUser);

export default router;
