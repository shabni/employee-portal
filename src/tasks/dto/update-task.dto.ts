import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto, CreateTaskTrackDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}

export class UpdateTaskTrackDto extends PartialType(CreateTaskTrackDto) {}
