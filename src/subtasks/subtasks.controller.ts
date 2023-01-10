import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubtasksService } from './subtasks.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/subtasks')
@ApiTags('SubTasks')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Post('createSubTasks')
  create(@Body() createSubtaskDto: CreateSubtaskDto[]) {
    return this.subtasksService.createSubTasks(createSubtaskDto);
  }

  @Get('getAllSubTasks/:id')
  getAllSubTasks(@Param('id') id: string) {
    return this.subtasksService.getAllSubTasks(id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.subtasksService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSubtaskDto: UpdateSubtaskDto) {
  //   return this.subtasksService.update(+id, updateSubtaskDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.subtasksService.remove(+id);
  // }
}
