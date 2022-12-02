import { ApiProperty } from "@nestjs/swagger";

export class LogInDto {
    @ApiProperty()
    userName: string

    @ApiProperty()
    password: string
}

export class logInUserDto {
    @ApiProperty()
    is_LoggedIn: boolean
}

export class logOutUserDto {
    @ApiProperty()
    user_id: string
}