import { Module } from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { AttendenceController } from './attendence.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AttendenceController],
  providers: [AttendenceService],
  imports: [PrismaModule]
})
export class AttendenceModule {}
