import { Injectable } from '@nestjs/common';
import { datesForCreate, MakeTimedIDUnique } from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Injectable()
export class SubtasksService {
  constructor(private prisma: PrismaService) {}
  async createSubTasks(createSubtaskDto: CreateSubtaskDto[]) {
    await this.prisma.subTasks.createMany({
      data: createSubtaskDto.map((subtask) => {
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
      where: {
        taskId: id,
      },
    });

    return subTasks;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} subtask`;
  // }

  // update(id: number, updateSubtaskDto: UpdateSubtaskDto) {
  //   return `This action updates a #${id} subtask`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} subtask`;
  // }
}
