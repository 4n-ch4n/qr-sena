import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';

@Injectable()
export class FilesService {
  private bucketPath: string = 'pets';
  private s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('DO_SPACE_REGION') ?? '',
      endpoint: this.configService.get<string>('DO_SPACES_URL') ?? '',
      credentials: {
        accessKeyId:
          this.configService.get<string>('DO_SPACES_ACCESS_KEY') ?? '',
        secretAccessKey:
          this.configService.get<string>('DO_SPACE_SECRET_KEY') ?? '',
      },
      forcePathStyle: false,
    });
  }

  getStaticPetImage(imageName: string) {
    const path = `${this.configService.get<string>('DO_SPACES_CDN_URL')}/${this.bucketPath}/${imageName}`;
    return path;
  }

  async uploadPetImage(file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException('Make sure that the file is an image');

    const fileName = `${v4()}.${file.originalname.split('.').pop()}`;
    const key = `${this.bucketPath}/${fileName}`;
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('DO_SPACES_BUCKET') ?? '',
      Key: key,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    const secureUrl = `${this.configService.get<string>('DO_SPACES_CDN_URL')}/${key}`;

    return {
      secureUrl,
      fileName,
    };
  }
}
