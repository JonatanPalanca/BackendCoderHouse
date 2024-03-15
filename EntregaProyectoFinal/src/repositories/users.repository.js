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

  getUserByIdRepository = async (uid) => {
    const user = await this.dao.getUserById(uid);
    return user;
  };

  updatePremiumStatusRepository = async (uid, role) => {
    const user = await this.dao.updatePremiumStatus(uid, role);
    return user;
  };

  saveRepository = async () => {
    const result = await this.dao.save();
    return result;
  };
}
