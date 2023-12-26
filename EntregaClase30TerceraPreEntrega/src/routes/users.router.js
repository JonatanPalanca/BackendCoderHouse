import { Router } from "express";
import { Users } from "../dao/factory.js";
import {
  registerController,
  loginController,
} from "../controllers/users.controller.js";
import UsersDto from "../DTOs/users.dto.js";
import UsersRepository from "../repositories/users.repository.js";

const router = Router();
const usersDao = new Users();
const usersRepository = new UsersRepository(usersDao);

router.get("/", async (req, res) => {
  const data = await usersRepository.getUsers();
  res.json(data);
});

router.post("/", async (req, res) => {
  const { first_name, last_name, email, age, password, cart, role } = req.body;
  const data = await usersRepository.createUser({
    first_name,
    last_name,
    email,
    age,
    password,
    cart,
    role,
  });

  res.json(data);
});

router.post("/register", registerController);
router.post("/login", loginController);

export default router;
