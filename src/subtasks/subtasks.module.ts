import { Module } from '@nestjs/common';
import { SubtasksService } from './subtasks.service';
import { SubtasksController } from './subtasks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [SubtasksController],
  providers: [SubtasksService],
  imports: [PrismaModule],
})
export class SubtasksModule {}
