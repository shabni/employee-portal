import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import {
  datesForCreate,
  MakeTimedIDUnique,
  unixTimestamp,
} from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  createTask(createTaskDto: CreateTaskDto) {
    return this.prisma.tasks.create({
      data: {
        taskId: MakeTimedIDUnique(),
        ...createTaskDto,
        ...datesForCreate(),
      },
    });
  }

  getAllTasks() {
    return this.prisma.tasks.findMany({
      select: { taskId: true, title: true },
    });
  }

  async getTaskById(id: string) {
    try {
      const task = await this.prisma.tasks.findFirstOrThrow({
        select: { taskId: true, title: true },
        where: { taskId: id },
      });
      return task;
    } catch (exception) {
      throw new NotFoundException('Task Id must be valid');
    }
  }

  updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    return this.prisma.tasks.update({
      where: { taskId: id },
      data: { ...updateTaskDto, updatedAt: unixTimestamp() },
    });
  }
}
