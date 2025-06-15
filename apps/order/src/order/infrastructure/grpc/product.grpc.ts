import { Inject, OnModuleInit } from '@nestjs/common';
import { ProductOutputPort } from '../../port/output/product.output-port';
import { ProductEntity } from '../../domain/product.entity';
import { Promise } from 'mongoose';
import { PRODUCT_SERVICE, ProductMicroservice } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GetProductsIdsResponseMapper } from './mapper/get-product-info-response.mapper';

export class ProductGrpc implements ProductOutputPort, OnModuleInit {
  productClient: ProductMicroservice.ProductServiceClient;
  constructor(
    @Inject(PRODUCT_SERVICE)
    private readonly productMicroservice: ClientGrpc,
  ) {}
  onModuleInit() {
    this.productClient =
      this.productMicroservice.getService<ProductMicroservice.ProductServiceClient>(
        'ProductService',
      );
  }
  async getProductsByIds(productIds: string[]): Promise<ProductEntity[]> {
    const resp = await lastValueFrom(
      this.productClient.getProductsInfo({
        productIds,
      }),
    );
    return new GetProductsIdsResponseMapper(resp).toDomain();
  }
}
