import { ApiProperty } from "@nestjs/swagger";

export class CreateSettingDto {}

export class CreateRoleDto{
    @ApiProperty({required:true})
    title: string;

    @ApiProperty({required:true})
    scale: number;

}
