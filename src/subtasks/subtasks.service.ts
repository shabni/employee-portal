import { Injectable } from '@nestjs/common';
import {
  datesForCreate,
  MakeTimedIDUnique,
  unixTimestamp,
} from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Injectable()
export class SubtasksService {
  constructor(private prisma: PrismaService) {}
  async createSubTasks(createSubtaskDto: CreateSubtaskDto[]) {
    await this.prisma.subTasks.createMany({
      data: createSubtaskDto.map((subtask) => {
        if (!subtask['subTaskId'])
          return {
            subTaskId: MakeTimedIDUnique(),
            ...subtask,
            ...datesForCreate(),
          };
      }),
    });
  }

  async getAllSubTasks(id: string) {
    const subTasks = await this.prisma.subTasks.findMany({
      select: { subTaskId: true, title: true, taskId: true },
      where: {
        taskId: id,
        isDeleted: false,
      },
    });

    return subTasks;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} subtask`;
  // }

  updateSubtask(id: string, updateSubtaskDto: UpdateSubtaskDto) {
    return this.prisma.subTasks.update({
      where: { subTaskId: id },
      data: { ...updateSubtaskDto, updatedAt: unixTimestamp() },
    });
  }

  // remove(id: number) {
  //   return `This action removes a #${id} subtask`;
  // }
}
