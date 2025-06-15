import { Inject, Injectable } from '@nestjs/common';
import { OrderOutputPort } from '../port/output/order.output-port';

@Injectable()
export class CancelOrderUseCase {
  constructor(
    @Inject('OrderOutputPort')
    private readonly orderOutputPort: OrderOutputPort,
  ) {}
  async execute(orderId: string) {
    const order = await this.orderOutputPort.getOrder(orderId);
    order.cancelOrder();
    await this.orderOutputPort.updateOrder(order);
  }
}
