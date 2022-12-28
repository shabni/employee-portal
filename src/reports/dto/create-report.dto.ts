import { ApiProperty } from '@nestjs/swagger';
import { IsNotNull } from '@nestjsi/class-validator';

export class CreateReportDto {
  @IsNotNull()
  @ApiProperty()
  description: string;

  @ApiProperty()
  reportDate: bigint;

  @IsNotNull()
  @ApiProperty()
  userId: string;
}
