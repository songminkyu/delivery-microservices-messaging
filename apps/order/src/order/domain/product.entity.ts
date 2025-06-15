export class ProductEntity {
  productId: string;
  name: string;
  price: number;

  constructor(param: ProductEntity) {
    this.productId = param.productId;
    this.name = param.name;
    this.price = param.price;
  }
}
