import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('pet/:imageName')
  findPetImage(@Param('imageName') imageName: string) {
    return this.filesService.getStaticPetImage(imageName);
  }

  @Post('pet')
  @UseInterceptors(FileInterceptor('file', { fileFilter }))
  uploadPetImage(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadPetImage(file);
  }
}
