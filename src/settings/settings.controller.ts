import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateSettingDto } from './dto/role-setting.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/settings')
@ApiTags('Settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post('createRole')
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.settingsService.createRole(createRoleDto);
  }

  @Get('getScales')
  getScales() {
    return { scales: ['1', '2', '3', '4', '5'] };
  }

  @Get('getRoles')
  findAllRoles() {
    return this.settingsService.findAllRoles();
  }

  @Get('getRole/:id')
  findOne(@Param('id') id: string) {
    return this.settingsService.findOne(id);
  }

  @Patch('updateRole/:id')
  updateRole(
    @Param('id') id: string,
    @Body() updateSettingDto: UpdateSettingDto,
  ) {
    return this.settingsService.updateRole(id, updateSettingDto);
  }
}
