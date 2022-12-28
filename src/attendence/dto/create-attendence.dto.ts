import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendenceDto {
  @ApiProperty()
  attendenceDate: bigint;

  @ApiProperty()
  checkInTime: bigint;

  @ApiProperty()
  checkOutTime?: bigint;

  @ApiProperty({ required: false })
  userId: string;

  @ApiProperty({ required: false })
  userName: string;
}
