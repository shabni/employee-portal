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

@Controller('api/tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
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
}
