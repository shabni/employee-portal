import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
export class ResponseTaskTrackDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  taskId?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  userId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: true })
  taskTrackId?: string;
}
