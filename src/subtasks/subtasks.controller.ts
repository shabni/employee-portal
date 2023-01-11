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
import { BulkSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/subtasks')
@ApiTags('SubTasks')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Post('createSubTasks')
  create(@Body() bulkSubtaskDto: BulkSubtaskDto[]) {
    return this.subtasksService.createSubTasks(bulkSubtaskDto);
  }

  @Get('getAllSubTasks/:id')
  getAllSubTasks(@Param('id') id: string) {
    return this.subtasksService.getAllSubTasks(id);
  }

  @Patch('updateSubTask/:id')
  updateSubtask(
    @Param('id') id: string,
    @Body() updateSubtaskDto: UpdateSubtaskDto,
  ) {
    return this.subtasksService.updateSubtask(id, updateSubtaskDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.subtasksService.remove(id);
  // }
}
