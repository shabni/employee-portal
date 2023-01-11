import { ApiProperty } from '@nestjs/swagger';

export class UserIdsDto {
  @ApiProperty({ required: false })
  userId?: string;

  @ApiProperty({ required: false })
  fName?: string;

  @ApiProperty({ required: false })
  lName?: string;
}
