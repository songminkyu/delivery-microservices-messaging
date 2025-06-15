import { PaymentMicroservice } from '@app/common';
import { OrderEntity } from '../../../domain/order.entity';
import { PaymentDto } from '../../../usecase/dto/create-order.dto';
import { PaymentMethod } from '../../../domain/payment.entity';
export class MakePaymentResponseMapper {
  constructor(
    private readonly response: PaymentMicroservice.MakePaymentResponse,
  ) {}

  toDomain(order: OrderEntity, payment: PaymentDto): OrderEntity {
    order.setPayment({
      ...payment,
      ...this.response,
      paymentId: this.response.id,
      paymentMethod: this.parsePaymentMethod(payment.paymentMethod),
    });

    return order;
  }
  private parsePaymentMethod(paymentMethod: string) {
    switch (paymentMethod) {
      case 'CreditCard':
        return PaymentMethod.creditCard;
      case 'Kakao':
        return PaymentMethod.kakao;
      default:
        throw new Error('알수 없는 결제 방식 입니다');
    }
  }
}
