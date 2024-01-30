import UsersDto from "../DTO/users.dto.js";

export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUserByEmailRepository = async (email) => {
    const user = await this.dao.getUserByEmail(email);
    const userToReturn = new UsersDto(user);
    return userToReturn;
  };

  saveRepository = async () => {
    const result = await this.dao.save();
    return result;
  };
}

(req, res) => {
  const data = new UsersDto(req.user);
  res.send({ status: "success", payload: data });
};
