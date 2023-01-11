import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags } from '@nestjs/swagger';
import { StopTaskDto } from './dto/stop-task.dto';
import { CreateTaskTrackDto } from './dto/create-task-track.dto';

@Controller('api/tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('createTask')
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('getAllTasks')
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Get('getTaskById/:id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Patch('updateTask/:id')
  updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Post('createTaskTrack')
  createTaskTrack(@Body() createTaskTrackDto: CreateTaskTrackDto) {
    return this.tasksService.createTaskTrack(createTaskTrackDto);
  }

  @Get('userActiveTask/:id')
  getUserActiveTask(@Param('id') id: string) {
    return this.tasksService.getUserActiveTask(id);
  }

  @Post('stopTask')
  stopTask(@Body() stopTaskDto: StopTaskDto) {
    return this.tasksService.stopTask(stopTaskDto);
  }
}
