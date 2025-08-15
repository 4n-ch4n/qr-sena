/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MercadoPagoMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const xSignature = req.headers['x-signature'] as string;
    const xRequestId = req.headers['x-request-id'] as string;
    const dataID = req.body.data?.id || (req.query['data.id'] as string);

    if (!xSignature || !xRequestId || !dataID) {
      console.warn('Incomplete webhook data', {
        hasSignature: !!xSignature,
        hasRequestId: !!xRequestId,
        hasDataId: !!dataID,
      });

      throw new BadRequestException('Invalid request');
    }

    const parts = xSignature.split(',');

    let ts;
    let hash;

    parts.forEach((part) => {
      const [key, value] = part.split('=');
      if (key && value) {
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
        if (trimmedKey === 'ts') {
          ts = trimmedValue;
        } else if (trimmedKey === 'v1') {
          hash = trimmedValue;
        }
      }
    });

    const secret = this.configService.get<string>('WEBHOOK_SECRET');

    if (!secret) throw new InternalServerErrorException();

    const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(manifest);

    const calculatedHash = hmac.digest('hex');

    if (calculatedHash !== hash) {
      console.warn('HMAC verification failed', {
        calculatedHash,
        receivedHash: hash,
      });

      throw new BadRequestException('Invalid signature');
    }

    next();
  }
}
