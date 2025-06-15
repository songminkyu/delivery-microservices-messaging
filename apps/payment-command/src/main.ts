import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PaymentMicroservice } from '@app/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: PaymentMicroservice.protobufPackage,
      protoPath: join(process.cwd(), 'proto/payment.proto'),
      url: configService.getOrThrow('GRPC_URL'),
    },
  });

  app.connectMicroservice({
    transport: Transport.KAFKA,
    client: {
      clientId: 'payment-command',
      brokers: ['kafka:9092'],
    },
    consumer: {
      groupId: 'payment-command-consumer',
    },
  });

  await app.init();

  await app.startAllMicroservices();
}
bootstrap();
