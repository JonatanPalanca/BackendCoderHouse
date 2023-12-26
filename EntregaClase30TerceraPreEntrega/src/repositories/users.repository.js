import UsersDto from "../DTOs/users.dto.js";

export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUsers = async () => {
    const result = await this.dao.get();
    return result;
  };

  createUser = async (user) => {
    const userToInsert = new UsersDto(user);
    const result = await this.dao.create(userToInsert);
    return result;
  };
}

//Capa de repositorios esta centrada en manejar objetos a nivel del dominio
// {
//     name: 'asd',
//     phone: 'adsad'
// }

//Capa de acceso a los datos o nuestros daos, esta centrada en manejar objetos directos hacia la BDD
// {
//     name: String,
//     phone: String,
//     //Campos de auditoria
//     created_at,
//     updated_at
//     deleted_at
// }
