import { CreateOrderDto } from './dto/create-order.dto';
import { UserOutputPort } from '../port/output/user.output-port';
import { ProductOutputPort } from '../port/output/product.output-port';
import { OrderEntity } from '../domain/order.entity';
import { OrderOutputPort } from '../port/output/order.output-port';
import { PaymentOutputPort } from '../port/output/payment.output-port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('UserOutputPort')
    private readonly userOutputPort: UserOutputPort,
    @Inject('ProductOutputPort')
    private readonly productOutputPort: ProductOutputPort,
    @Inject('OrderOutputPort')
    private readonly orderOutputPort: OrderOutputPort,
    @Inject('PaymentOutputPort')
    private readonly paymentOutputPort: PaymentOutputPort,
  ) {}
  async execute(dto: CreateOrderDto) {
    /// 1) User 값을 가져온다 - User
    const user = await this.userOutputPort.getUserById(dto.userId);

    /// 2) Products 정보를 가져온다 - Product
    const products = await this.productOutputPort.getProductsByIds(
      dto.productIds,
    );

    /// 3) 주문을 생성한다 - Order
    const order = new OrderEntity({
      customer: user,
      products: products,
      deliveryAddress: dto.address,
    });

    /// 4) 총액을 계산한다 (totalAmount) - Order
    order.calculateTotalAmount();

    /// 5) 생성된 주문을 데이터베이스에 저장한다 - Order
    const result = await this.orderOutputPort.createOrder(order);

    /// 6) 생성된 주문 ID를 저장한다 - Oroder
    order.setId(result.id);

    try {
      /// 7) 결제를 진행한다 - Payment
      const paymentResult = await this.paymentOutputPort.processPayment(
        order,
        dto.payment,
      );

      /// 8) 결제정보를 Order에 저장한다 -Order
      order.setPayment(paymentResult.payment);
      await this.orderOutputPort.updateOrder(order);

      return order;
    } catch (e) {
      /// 9) 만약에 7번 이후의 프로세스가 실패하면 주문을 취소한다 - Order
      order.cancelOrder();
      await this.orderOutputPort.updateOrder(order);
      return order;
    }
  }
}
