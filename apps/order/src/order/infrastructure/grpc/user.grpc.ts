import { Inject, OnModuleInit } from '@nestjs/common';
import { UserOutputPort } from '../../port/output/user.output-port';
import { CustomerEntity } from '../../domain/customer.entity';
import { USER_SERVICE, UserMicroservice } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GetUserInfoResponseMapper } from './mapper/get-user-info-response.mapper';

export class UserGrpc implements UserOutputPort, OnModuleInit {
  userClient: UserMicroservice.UserServiceClient;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userClient =
      this.userMicroservice.getService<UserMicroservice.UserServiceClient>(
        'UserService',
      );
  }
  async getUserById(userId: string): Promise<CustomerEntity> {
    const resp = await lastValueFrom(
      this.userClient.getUserInfo({
        userId,
      }),
    );
    return new GetUserInfoResponseMapper(resp).toDomain();
  }
}
