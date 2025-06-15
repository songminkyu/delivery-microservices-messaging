import { Document, ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum PaymentStatus {
  pending = 'Pending',
  rejected = 'Rejected',
  approved = 'Approved',
}

export enum PaymentMethod {
  creditCard = 'CreditCard',
  kakao = 'Kakao',
}

export enum NotificationStatus {
  pending = 'pending',
  sent = 'sent',
}

@Schema()
export class PaymentDocument extends Document<ObjectId> {
  @Prop({
    required: true,
  })
  userEmail: string;

  @Prop({
    required: true,
  })
  amount: number;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.pending,
    required: true,
  })
  paymentStatus: PaymentStatus;

  @Prop({
    required: true,
  })
  cardNumberLastFourDigits: string;

  @Prop({
    required: true,
  })
  orderId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentDocument);