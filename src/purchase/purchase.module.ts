import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PurchaseController],
  providers: [PurchaseService, PrismaService],
  imports: [ConfigModule, AuthModule],
  exports: [PurchaseService],
})
export class PurchaseModule {}
