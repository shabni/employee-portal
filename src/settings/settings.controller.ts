import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateSettingDto } from './dto/role-setting.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';

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

  @Post('/upload/:folderName')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let fs = require('fs-extra');
          let path = `./${req.params.folderName}`;
          fs.mkdirsSync(path);

          cb(null, path);
        },
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
    return { imgUrl };
  }

  @Get('/getProfileImage/profile/:imgUrl')
  findProfileImage(@Res() res, @Param('imgUrl') imgUrl: string) {
    return res.sendFile(join(process.cwd(), 'profile/' + imgUrl));
  }
}
