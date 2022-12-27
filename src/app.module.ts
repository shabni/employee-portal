import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AttendenceModule } from './attendence/attendence.module';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { ReportsModule } from './reports/reports.module';
import { CustomSocketModule } from './custom-socket/custom-socket.module';

@Module({
  imports: [PrismaModule, UserModule, AttendenceModule, AuthModule, SettingsModule, ReportsModule, CustomSocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
