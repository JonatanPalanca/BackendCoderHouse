import { Router } from "express";
import { Messages } from "../dao/dbManagers/models/messages.model.js";

const router = Router();

router.get("/messages", async (req, res) => {
  try {
    const messages = await Messages.find();
    res.send({ status: "success", payload: messages });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

export default router;
