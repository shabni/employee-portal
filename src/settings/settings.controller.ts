import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateRoleDto, CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ApiTags } from '@nestjs/swagger';


@Controller('api/settings')
@ApiTags('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post('/createRole')
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.settingsService.createRole(createRoleDto);
  }

  // @Get()
  // findAll() {
  //   return this.settingsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.settingsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
  //   return this.settingsService.update(+id, updateSettingDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.settingsService.remove(+id);
  // }
}
