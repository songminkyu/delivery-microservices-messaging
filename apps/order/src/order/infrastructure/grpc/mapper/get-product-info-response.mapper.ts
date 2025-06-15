import { ProductMicroservice } from '@app/common';
import { ProductEntity } from '../../../domain/product.entity';

export class GetProductsIdsResponseMapper {
  constructor(
    private readonly response: ProductMicroservice.GetProductsInfoResponse,
  ) {}
  toDomain(): ProductEntity[] {
    return this.response.products.map(
      (product) =>
        new ProductEntity({
          productId: product.id,
          name: product.name,
          price: product.price,
        }),
    );
  }
}
