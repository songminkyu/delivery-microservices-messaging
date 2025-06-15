import { Module } from '@nestjs/common';
import { PaymentQueryController } from './payment-query.controller';
import { PaymentQueryService } from './payment-query.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentDocument, PaymentSchema } from './document/payment.document';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PaymentDocument.name,
        schema: PaymentSchema,
      }
    ])
  ],
  controllers: [PaymentQueryController],
  providers: [PaymentQueryService],
})
export class PaymentQueryModule {}
