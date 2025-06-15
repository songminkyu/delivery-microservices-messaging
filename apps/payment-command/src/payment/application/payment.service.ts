import { Inject, Injectable } from '@nestjs/common';
import { PaymentMethod, PaymentModel } from '../domain/payment.domain';
import { DatabaseOutputPort } from '../port/output/database.output-port';
import { PaymentOutputPort } from '../port/output/payment.output-port';
import { NetworkOutputPort } from '../port/output/network.output-port';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('DatabaseOutputPort')
    private readonly databaseOutputPort: DatabaseOutputPort,
    @Inject('PaymentOutputPort')
    private readonly paymentOutputPort: PaymentOutputPort,
    @Inject('NetworkOutputPort')
    private readonly networkOutputPort: NetworkOutputPort,
  ) {}
  async makePayment(param: {
    orderId: string;
    userEmail: string;
    paymentMethod: PaymentMethod;
    cardNumber: string;
    expiryYear: string;
    expiryMonth: string;
    birthOrRegistration: string;
    passwordTwoDigits: string;
    amount: number;
  }) {
    // 1) 파라미터로 PaymentModel을 생성한다. -> Domain
    const payment = new PaymentModel(param);
    // 2) PaymentModel을 저장한다 -> Database
    const result = await this.databaseOutputPort.savePayment(payment);
    // 3) 저장된 데이터의 ID를 PaymentMOdel에 저장한다. -> Domain
    payment.assignId(result.id);

    try {
      // 4) 결제를 실행 한다. -> HTTP
      await this.paymentOutputPort.processPayment(payment);

      // 5) 결제 데이터를 업데이트 한다 -> Database
      payment.processPayment();
      await this.databaseOutputPort.updatePayment(payment);
    } catch (e) {
      // 7) 만약 실패하면 (4,5) 결제를 Reject 한다 -> Database, Domain
      payment.rejectPayment();
      await this.databaseOutputPort.updatePayment(payment);
      return payment;
    }

    // 6) 알림을 보낸다. -> gRPC
    this.networkOutputPort.sendNotification(param.orderId, param.userEmail);
    return payment;
  }
}
