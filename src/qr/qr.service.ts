import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
  async generateQrCode(id: string) {
    return await QRCode.toDataURL(`http://localhost/register/${id}`);
  }
}
