import { getUserCurrent as getUserCurrentService } from "../services/users.service.js";
import logger from "../utils/logger.js";

export const getUserCurrent = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await getUserCurrentService(email);
    res.status(200).send({ status: "success", payload: user });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ status: "error", error: error.message });
  }
};
