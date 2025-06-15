import { Injectable } from '@nestjs/common';
import { PaymentDocument } from './document/payment.document';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PaymentQueryService {
  constructor(
    @InjectModel(PaymentDocument.name)
    private readonly paymentRepository: Model<PaymentDocument>,
  ) {}
  async saveDocument(document: PaymentDocument) {
    return this.paymentRepository.create(document);
  }

  async updateDocument(document: PaymentDocument) {
    const { orderId, ...rest } = document;
    return this.paymentRepository.findOneAndUpdate({ orderId }, rest);
  }
}
