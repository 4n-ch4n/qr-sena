import { Injectable } from '@nestjs/common';
import { PurchaseService } from 'src/purchase/purchase.service';
import { MercadoPagoPayloadDTO } from './dto/mercadopago-payload.dto';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly purchaseService: PurchaseService,
    private readonly mailerService: MailerService,
  ) {}

  async mercadoPagoWebhook(payload: MercadoPagoPayloadDTO) {
    if (payload.type === 'payment') {
      const mpPayment = await this.purchaseService.getPaymentById(
        payload.data.id,
      );

      if (!mpPayment.id) throw new Error('Payment not found');

      if (mpPayment.status === 'approved') {
        const purchaseId = mpPayment.external_reference;

        await this.purchaseService.changePurchaseStatusToPaid(
          purchaseId ?? '',
          BigInt(mpPayment.id),
        );

        const purchaseDetails = await this.purchaseService.findOne(
          purchaseId ?? '',
        );

        await this.mailerService.sendPurchaseConfirmation(
          {
            to: purchaseDetails.user.email,
            subject: 'Confirmación de Compra',
          },
          purchaseDetails.id,
        );
      }
    }
  }
}
