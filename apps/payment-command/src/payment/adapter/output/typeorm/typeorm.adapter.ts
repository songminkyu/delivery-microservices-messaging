import { DatabaseOutputPort } from '../../../port/output/database.output-port';
import { PaymentModel } from '../../../domain/payment.domain';
import { Promise } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/payment.entity';
import { Repository } from 'typeorm';
import { PaymentEntityMapper } from './mapper/payment-entity.mapper';

export class TypeormAdapter implements DatabaseOutputPort {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}
  async savePayment(payment: PaymentModel): Promise<PaymentModel> {
    const result = await this.paymentRepository.save(payment);
    return new PaymentEntityMapper(result).toDomain();
  }

  async updatePayment(payment: PaymentModel): Promise<PaymentModel> {
    await this.paymentRepository.update(payment.id, payment);
    const result = await this.paymentRepository.findOne({
      where: {
        id: payment.id,
      },
    });
    return new PaymentEntityMapper(result).toDomain();
  }
}
