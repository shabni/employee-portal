import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateRoleDto, CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';

@Controller('api/settings')
@ApiTags('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post('/createRole')
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.settingsService.createRole(createRoleDto);
  }

  @Get('/getScales')
  getScales() {
    return { scales: ['1', '2', '3', '4', '5'] };
  }

  @Get('/getRoles')
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

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename: string =
            path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  uploadSingle(@UploadedFile() file) {
    let imgUrl = file.path.replace(/\\/g, '/');
    imgUrl = imgUrl.substring(imgUrl.indexOf('uploads') + 8);
    return { imgUrl };
  }

  @Get('/getProfileImage/:imgUrl')
  gindProfileImage(@Res() res, @Param('imgUrl') imgUrl: string) {
    return res.sendFile(join(process.cwd(), 'uploads/' + imgUrl));
  }
}
