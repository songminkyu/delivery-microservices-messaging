export class CustomerEntity {
  userId: string;
  email: string;
  name: string;

  constructor(param: CustomerEntity) {
    this.userId = param.userId;
    this.email = param.email;
    this.name = param.name;
  }
}
