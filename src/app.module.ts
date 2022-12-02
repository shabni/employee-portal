import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AttendenceModule } from './attendence/attendence.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, UserModule, AttendenceModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
