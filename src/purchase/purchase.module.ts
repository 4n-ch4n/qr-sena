import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { PrinterModule } from 'src/printer/printer.module';

@Module({
  controllers: [PurchaseController],
  providers: [PurchaseService, PrismaService],
  imports: [ConfigModule, AuthModule, PrinterModule],
  exports: [PurchaseService],
})
export class PurchaseModule {}
