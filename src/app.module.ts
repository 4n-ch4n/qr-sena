import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PetsModule } from './pets/pets.module';
import { QrService } from './qr/qr.service';
import { FilesModule } from './files/files.module';
import { AdminModule } from './admin/admin.module';
import { LostPetReportModule } from './lost-pet-report/lost-pet-report.module';
import { PurchaseModule } from './purchase/purchase.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { PrinterModule } from './printer/printer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PetsModule,
    FilesModule,
    AdminModule,
    LostPetReportModule,
    PurchaseModule,
    WebhooksModule,
    PrinterModule,
  ],
  providers: [QrService],
})
export class AppModule {}
