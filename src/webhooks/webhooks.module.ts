import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { PurchaseModule } from 'src/purchase/purchase.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { MercadoPagoMiddleware } from './middlewares/mercado-pago.middleware';

@Module({
  controllers: [WebhooksController],
  providers: [WebhooksService],
  imports: [PurchaseModule, MailerModule, ConfigModule],
})
export class WebhooksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MercadoPagoMiddleware).forRoutes('webhooks/mercadopago');
  }
}
