import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto, CreateSettingDto } from './create-setting.dto';

export class UpdateSettingDto extends PartialType(CreateRoleDto) {}
