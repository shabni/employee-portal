import { Module } from '@nestjs/common';
import { CustomeSocketGateway } from './custom-sockets.gateway';

@Module({
  providers: [CustomeSocketGateway],
})
export class CustomSocketModule {}
