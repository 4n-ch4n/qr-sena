import { Response } from 'express';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

import { fileNamer, fileFilter } from './helpers';
import { FilesService } from './files.service';
import { diskStorage } from 'multer';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('pet/:imageName')
  findPetImage(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.getStaticPetImage(imageName);

    res.sendFile(path);
  }

  @Post('pet')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      storage: diskStorage({
        destination: './static/pets',
        filename: fileNamer,
      }),
    }),
  )
  uploadPetImage(@UploadedFile() file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException('Make sure that the file is an image');

    const secureUrl = `${this.configService.get('HOST_API')}/files/pet/${file.filename}`;

    return {
      secureUrl,
      fileName: file.filename,
    };
  }
}
