import { Body, Controller, Post } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { MercadoPagoPayloadDTO } from './dto/mercadopago-payload.dto';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('mercadopago')
  mercadoPagoWebhook(@Body() payload: MercadoPagoPayloadDTO) {
    return this.webhooksService.mercadoPagoWebhook(payload);
  }
}
