import { DatabaseOutputPort } from '../../../port/output/database.output-port';
import { Model, Promise } from 'mongoose';
import { PaymentDocument } from './document/payment.document';
import { PaymentModel } from '../../../domain/payment.domain';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentDocumentMapper } from './mapper/payment-document.mapper';
import { Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

export class MongooseAdapter
  implements DatabaseOutputPort, OnModuleInit, OnModuleDestroy
{
  constructor(
    @InjectModel(PaymentDocument.name)
    private readonly paymentModel: Model<PaymentDocument>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaService.connect();
  }
  async onModuleDestroy() {
    await this.kafkaService.close();
  }
  async savePayment(payment: PaymentModel): Promise<PaymentModel> {
    const model = await this.paymentModel.create(payment);
    const mappert = new PaymentDocumentMapper(model);
    this.kafkaService.emit(
      'payment.created',
      mappert.toPaymentQueryMicroservicePayload(),
    );

    return mappert.toDomain();
  }

  async updatePayment(payment: PaymentModel): Promise<PaymentModel> {
    const model = await this.paymentModel.create(payment);
    // const model = await this.paymentModel.findByIdAndUpdate(
    //   payment.id,
    //   payment,
    //   {
    //     new: true,
    //   },
    // );

    const mappert = new PaymentDocumentMapper(model);
    this.kafkaService.emit(
      'payment.updated',
      mappert.toPaymentQueryMicroservicePayload(),
    );
    return mappert.toDomain();
  }
}
