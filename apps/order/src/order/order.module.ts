import { Module } from '@nestjs/common';
import { OrderController } from './infrastructure/framework/order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateOrderUseCase } from './usecase/create-order.usecase';
import { StartDeliveryUseCase } from './usecase/start-delivery.usecase';
import {
  OrderDocument,
  OrderSchema,
} from './infrastructure/mongoose/entity/order.entity';
import { OrderRepository } from './infrastructure/mongoose/repository/order.repository';
import { PaymentGrpc } from './infrastructure/grpc/payment.grpc';
import { ProductGrpc } from './infrastructure/grpc/product.grpc';
import { UserGrpc } from './infrastructure/grpc/user.grpc';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OrderDocument.name,
        schema: OrderSchema,
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    CreateOrderUseCase,
    StartDeliveryUseCase,
    {
      provide: 'OrderOutputPort',
      useClass: OrderRepository,
    },
    {
      provide: 'PaymentOutputPort',
      useClass: PaymentGrpc,
    },
    {
      provide: 'ProductOutputPort',
      useClass: ProductGrpc,
    },
    {
      provide: 'UserOutputPort',
      useClass: UserGrpc,
    },
  ],
})
export class OrderModule {}
