import { ApiProperty } from "@nestjs/swagger";
import { IsNotNull } from "@nestjsi/class-validator";

export class CreateReportDto {
  
  @IsNotNull()
  @ApiProperty()
  description: string;

  @ApiProperty()
  report_date: bigint;
  
  @IsNotNull()
  @ApiProperty()
  user_id: string;
}
