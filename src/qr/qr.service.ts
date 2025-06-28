import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
  constructor(private readonly configService: ConfigService) {}

  async generateQrCode(id: string) {
    const baseUrl = this.configService.get<string>('FRONT_URL');
    return await QRCode.toDataURL(`${baseUrl}/mascota/${id}`);
  }
}
