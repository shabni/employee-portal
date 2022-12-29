import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  description: string;

  @IsNumber()
  @ApiProperty({ required: true })
  reportDate: bigint;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  userId: string;
}
