export default class UsersDto {
  constructor(user) {
    this.name = user.first_name;
    this.lastName = user.last_name;
    this.email = user.email;
    this.role = user.role;
  }
}
