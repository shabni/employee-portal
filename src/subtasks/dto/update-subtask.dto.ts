import { PartialType } from '@nestjs/swagger';
import { BulkSubtaskDto } from './create-subtask.dto';

export class UpdateSubtaskDto extends PartialType(BulkSubtaskDto) {}
