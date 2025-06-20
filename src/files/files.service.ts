import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getStaticPetImage(imageName: string) {
    const path = join(__dirname, '../../static/pets', imageName);

    if (!existsSync(path))
      throw new BadRequestException(`No pet found with imge ${imageName}`);

    return path;
  }
}
