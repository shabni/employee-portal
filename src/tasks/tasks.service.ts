import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import {
  datesForCreate,
  MakeTimedIDUnique,
  unixTimestamp,
} from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto, CreateTaskTrackDto } from './dto/create-task.dto';
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

  async makeTasksInactive(id) {
    const activeTaskIds = await this.prisma.taskTracks.findMany({
      select: {
        taskTrackId: true,
        startDate: true,
      },
      where: { userId: id, isActive: true },
    });

    activeTaskIds.forEach((element) => {
      this.updateTaskTrack(element.taskTrackId, {
        isActive: false,
        endDate: unixTimestamp(),
        duration: unixTimestamp() - Number(element.startDate),
      });
    });
  }

  async createTaskTrack(createTaskTrackDto: CreateTaskTrackDto) {
    this.makeTasksInactive(createTaskTrackDto.userId);

    let dataToinput = {
      taskTrackId: MakeTimedIDUnique(),
      ...createTaskTrackDto,
      ...datesForCreate(),
      startDate: unixTimestamp(),
      endDate: null,
      duration: null,
      isActive: true,
    };
    const taskTrack = await this.prisma.taskTracks.create({
      data: dataToinput,
    });

    const task = await this.getTaskById(taskTrack.taskId);
    return task;
  }

  async updateTaskTrack(id: string, updateTaskDto: any) {
    const taskTrack = await this.prisma.taskTracks.update({
      where: { taskTrackId: id },
      data: { ...updateTaskDto, updatedAt: unixTimestamp() },
    });

    return taskTrack;
  }

  async getUserActiveTask(id: string) {
    let task = await this.prisma.taskTracks.findFirst({
      select: {
        taskId: true,
      },
      where: {
        userId: id,
        isActive: true,
      },
    });

    if (task) {
      task = await this.getTaskDetails(task.taskId);
    }

    return task;
  }

  async getTaskDetails(id: string) {
    try {
      const task = await this.prisma.tasks.findFirst({
        select: { taskId: true, title: true },
        where: { taskId: id },
      });
      return task;
    } catch (exception) {
      return exception;
    }
  }
}
