import { Module } from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { AttendenceController } from './attendence.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AttendenceController],
  providers: [AttendenceService, UserService, AuthService],
  imports: [PrismaModule, JwtModule.register({})],
})
export class AttendenceModule {}
