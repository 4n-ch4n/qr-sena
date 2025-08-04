import { Injectable } from '@nestjs/common';
import { PurchaseService } from 'src/purchase/purchase.service';
import { MercadoPagoPayloadDTO } from './dto/mercadopago-payload.dto';

@Injectable()
export class WebhooksService {
  constructor(private readonly purchaseService: PurchaseService) {}

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
      }
    }
  }
}
