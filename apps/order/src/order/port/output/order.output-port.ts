import { OrderEntity } from '../../domain/order.entity';

export interface OrderOutputPort {
  getOrder(orderId: string): Promise<OrderEntity>;
  createOrder(order: OrderEntity): Promise<OrderEntity>;
  updateOrder(order: OrderEntity): Promise<OrderEntity>;
}
