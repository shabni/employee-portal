import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';

@Controller('api/uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('/:folderName')
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

  @Get('/getImage/profile/:imgUrl')
  findProfileImage(@Res() res, @Param('imgUrl') imgUrl: string) {
    return res.sendFile(join(process.cwd(), 'profile/' + imgUrl));
  }
}
