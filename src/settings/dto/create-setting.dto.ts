import { ApiProperty } from "@nestjs/swagger";

export class CreateSettingDto {}

export class CreateRoleDto{
    @ApiProperty()
    title: string;

}
