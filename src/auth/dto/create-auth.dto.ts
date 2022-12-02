import { ApiProperty } from "@nestjs/swagger";

export class LogInDto {
    @ApiProperty()
    userName: string

    @ApiProperty()
    password: string
}
