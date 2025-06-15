import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcInterceptor, OrderMicroservice } from '@app/common';
import { CreateOrderUseCase } from '../../usecase/create-order.usecase';
import { StartDeliveryUseCase } from '../../usecase/start-delivery.usecase';
import { CreateOrderRequestMapper } from './mapper/create-order-request.mapper';
import { CancelOrderUseCase } from '../../usecase/cancel-order-usecase';
import { EventPattern } from '@nestjs/microservices';

@Controller('order')
@OrderMicroservice.OrderServiceControllerMethods()
export class OrderController
  implements OrderMicroservice.OrderServiceController
{
  constructor(
    private readonly createOrderUsecase: CreateOrderUseCase,
    private readonly startDeliveryUseCase: StartDeliveryUseCase,
    private readonly cancelOrderUsease: CancelOrderUseCase,
  ) {}

  @UseInterceptors(GrpcInterceptor)
  async deliveryStarted(request: OrderMicroservice.DeliveryStartedRequest) {
    await this.startDeliveryUseCase.execute(request.id);
  }

  @UseInterceptors(GrpcInterceptor)
  async createOrder(request: OrderMicroservice.CreateOrderRequest) {
    return this.createOrderUsecase.execute(
      new CreateOrderRequestMapper(request).toDomain(),
    );
  }

  @EventPattern('order.notification.fail')
  async orderNotificationFail(orderId: string) {
    await this.cancelOrderUsease.execute(orderId);
  }
}
