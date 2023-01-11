import { PartialType } from '@nestjs/swagger';
import { UserIdsDto } from './user-ids.dto';

export class UpdateTeamDto extends PartialType(UserIdsDto) {}
