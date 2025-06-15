import { OrderEntity } from '../../domain/order.entity';
import { PaymentDto } from '../../usecase/dto/create-order.dto';

export interface PaymentOutputPort {
  processPayment(order: OrderEntity, payment: PaymentDto): Promise<OrderEntity>;
}
