import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAttendenceDto } from './create-attendence.dto';

export class UpdateAttendenceDto extends PartialType(CreateAttendenceDto) {
  @ApiProperty()
  checkOutTime?: bigint;
}
