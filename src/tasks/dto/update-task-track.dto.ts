import { PartialType } from '@nestjs/swagger';
import { CreateTaskTrackDto } from './create-task-track.dto';

export class UpdateTaskTrackDto extends PartialType(CreateTaskTrackDto) {}
