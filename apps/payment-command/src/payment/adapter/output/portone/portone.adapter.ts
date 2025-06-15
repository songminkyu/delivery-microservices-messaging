import { PaymentOutputPort } from '../../../port/output/payment.output-port';
import { PaymentModel } from '../../../domain/payment.domain';
import { Promise } from 'mongoose';

export class PortOneAdapter implements PaymentOutputPort {
  async processPayment(payment: PaymentModel): Promise<boolean> {
    //PortOne(PG사) 결제 기능 구현부
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }

  async cancelPayment(orderId: string): Promise<boolean> {
    //PortOne(PG사) 결제 취소 기능 구현부
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }
}
