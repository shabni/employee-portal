import { Injectable } from '@nestjs/common';
import {
  datesForCreate,
  MakeTimedIDUnique,
  unixTimestamp,
} from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { BulkSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Injectable()
export class SubtasksService {
  constructor(private prisma: PrismaService) {}
  async createSubTasks(bulkSubtaskDto: BulkSubtaskDto[]) {
    const updates = bulkSubtaskDto.filter((subtask) => subtask.subTaskId);
    await Promise.all(
      updates.map((subtask) =>
        this.updateSubtask(subtask.subTaskId, { title: subtask.title }),
      ),
    );

    const additions = bulkSubtaskDto.filter((subtask) => !subtask.subTaskId);
    if (additions.length) {
      await this.prisma.subTasks.createMany({
        data: additions.map(({ title, taskId }) => ({
          subTaskId: MakeTimedIDUnique(),
          title,
          taskId,
          ...datesForCreate(),
        })),
      });
    }
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

  async updateSubtask(id: string, updateSubtaskDto: UpdateSubtaskDto) {
    const updated = await this.prisma.subTasks.update({
      where: { subTaskId: id },
      data: { ...updateSubtaskDto, updatedAt: unixTimestamp() },
    });
  }

  // remove(id: string) {
  //   return `This action removes a #${id} subtask`;
  // }
}
