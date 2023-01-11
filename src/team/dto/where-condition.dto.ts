import { ApiProperty } from '@nestjs/swagger';

export class WhereCondition {
  @ApiProperty({ required: false })
  AND?: any;
}
