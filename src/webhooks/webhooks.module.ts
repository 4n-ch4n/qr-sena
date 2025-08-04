import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { PurchaseModule } from 'src/purchase/purchase.module';

@Module({
  controllers: [WebhooksController],
  providers: [WebhooksService],
  imports: [PurchaseModule],
})
export class WebhooksModule {}
