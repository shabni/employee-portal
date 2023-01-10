import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean, IsString, IsOptional } from 'class-validator';

export class BulkSubtaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  taskId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: true })
  subTaskId: string;
}
