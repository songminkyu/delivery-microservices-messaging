import { Controller } from '@nestjs/common';
import { PaymentQueryService } from './payment-query.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentDocument } from './document/payment.document';

@Controller()
export class PaymentQueryController {
  constructor(private readonly paymentQueryService: PaymentQueryService) {}

  @EventPattern('payment.created')
  async paymentCreate(@Payload() payload: PaymentDocument){
    await this.paymentQueryService.saveDocument(payload);
  }

  @EventPattern('payment.updated')
  async paymentUpdate(@Payload() payload: PaymentDocument){
    await this.paymentQueryService.updateDocument(payload);
  }
}
