export default class UsersDto {
  constructor(user) {
    this.name = `${user.name} ${user.lastname}`;
    this.email = `${user.email}`;
    this.age = `${user.age}`;
    this.cart = `${user.cart}`;
    this.role = `${user.role}`;
  }
}
