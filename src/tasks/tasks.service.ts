import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Prisma } from '@prisma/client';
import {
  datesForCreate,
  MakeTimedIDUnique,
  unixTimestamp,
} from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskTrackDto } from './dto/create-task-track.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { ResponseTaskTrackDto } from './dto/response-task-track.dto';
import { StopTaskDto } from './dto/stop-task.dto';
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

  async makeTasksInactive(id: string) {
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

    let dataToinput: Prisma.TaskTracksUncheckedCreateInput = {
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

    let responseTaskTrack: ResponseTaskTrackDto = {};
    responseTaskTrack = task;
    responseTaskTrack.taskTrackId = taskTrack.taskTrackId;
    return responseTaskTrack;
  }

  async updateTaskTrack(
    id: string,
    updateTaskDto: Prisma.TaskTracksUpdateInput,
  ) {
    const taskTrack = await this.prisma.taskTracks.update({
      where: { taskTrackId: id },
      data: { ...updateTaskDto, updatedAt: unixTimestamp() },
    });

    return taskTrack;
  }

  async getUserActiveTask(id: string) {
    const task = await this.prisma.taskTracks.findFirst({
      select: {
        taskTrackId: true,
        taskId: true,
      },
      where: {
        userId: id,
        isActive: true,
      },
    });

    let responseTask: ResponseTaskTrackDto = {};

    if (task) {
      let taskTrackId = task.taskTrackId;
      responseTask = await this.getTaskDetails(task.taskId);
      responseTask.taskTrackId = taskTrackId;
    }

    return responseTask;
  }

  async getTaskDetails(id: string) {
    const task = await this.prisma.tasks.findFirst({
      select: { taskId: true, title: true },
      where: { taskId: id },
    });
    return task;
  }

  async stopTask(activeToggleDto: StopTaskDto) {
    const startDate = await this.prisma.taskTracks.findFirst({
      select: {
        startDate: true,
      },
      where: {
        AND: [{ taskTrackId: activeToggleDto.taskTrackId }, { isActive: true }],
      },
    });

    if (startDate) {
      this.updateTaskTrack(activeToggleDto.taskTrackId, {
        isActive: false,
        endDate: unixTimestamp(),
        duration: unixTimestamp() - Number(startDate.startDate),
      });
    } else throw new NotFoundException('Invalid Id for active task');
  }
}
