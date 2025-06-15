import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { SendPaymentNotificationDto } from './dto/send-payment-notification.dto';
import { Notification, NotificationStatus } from './entity/notification.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Promise } from 'mongoose';
import { ClientGrpc, ClientKafka } from '@nestjs/microservices';
import {
  constructMetadata,
  ORDER_SERVICE,
  OrderMicroservice,
} from '@app/common';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class NotificationService implements OnModuleInit, OnModuleDestroy {
  orderService: OrderMicroservice.OrderServiceClient;

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @Inject(ORDER_SERVICE)
    private readonly orderMicroservice: ClientGrpc,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.orderService =
      this.orderMicroservice.getService<OrderMicroservice.OrderServiceClient>(
        'OrderService',
      );

    await this.kafkaService.connect();
  }
  async onModuleDestroy() {
    await this.kafkaService.close();
  }

  async sendPaymentNotification(
    data: SendPaymentNotificationDto,
    metadata: Metadata,
  ) {
    const notification = await this.createNotification(data.to);

    try {
      await this.sendEmail();

      await this.updateNotificationStatus(
        notification._id.toString(),
        NotificationStatus.sent,
      );
      /// Cold Observable vs Hot Observable
      this.sendDeliveryStartedMessage(data.orderId, metadata);

      return this.notificationModel.findById(notification._id);

    } catch (e) {
      this.kafkaService.emit('order.notification.fail', data.orderId);
      return this.notificationModel.findById(notification._id);
    }
  }

  sendDeliveryStartedMessage(id: string, metadata: Metadata) {
    this.orderService.deliveryStarted(
      {
        id,
      },
      constructMetadata(
        NotificationService.name,
        'sendDeliveryStartedMessage',
        metadata,
      ),
    );
  }

  async updateNotificationStatus(id: string, status: NotificationStatus) {
    return this.notificationModel.findByIdAndUpdate(id, { status });
  }

  async sendEmail() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async createNotification(to: string) {
    return this.notificationModel.create({
      from: 'jc@codefactory.ai',
      to: to,
      subject: '배송이 시작됐습니다!',
      content: `${to}님! 주문하신 물건이 배송이 시작됐습니다!`,
    });
  }
}
