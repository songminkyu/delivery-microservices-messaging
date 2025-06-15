import { PaymentOutputPort } from '../../port/output/payment.output-port';
import { OrderEntity, OrderStatus } from '../../domain/order.entity';
import { PaymentDto } from '../../usecase/dto/create-order.dto';
import { PAYMENT_SERVICE, PaymentMicroservice } from '@app/common';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { OrderEntityMapper } from './mapper/order-entity.mapper';
import { PaymentFailedException } from '../../exception/payment-failed.exception';
import { MakePaymentResponseMapper } from './mapper/make-payment-response.mapper';

export class PaymentGrpc implements PaymentOutputPort, OnModuleInit {
  paymentService: PaymentMicroservice.PaymentServiceClient;

  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly paymentMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.paymentService =
      this.paymentMicroservice.getService<PaymentMicroservice.PaymentServiceClient>(
        'PaymentService',
      );
  }
  async processPayment(
    order: OrderEntity,
    payment: PaymentDto,
  ): Promise<OrderEntity> {
    const resp = await lastValueFrom(
      this.paymentService.makePayment(
        new OrderEntityMapper(order).toMakePaymentRequest(payment),
      ),
    );

    const isPaid = resp.paymentStatus === 'Approved';
    const orderStatus = isPaid
      ? OrderStatus.paymentProcessed
      : OrderStatus.paymentFailed;

    if (orderStatus === OrderStatus.paymentFailed) {
      throw new PaymentFailedException(resp);
    }

    return new MakePaymentResponseMapper(resp).toDomain(order, payment);
  }
}
