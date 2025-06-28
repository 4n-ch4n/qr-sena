import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { QrService } from 'src/qr/qr.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService, QrService],
  imports: [AuthModule],
})
export class AdminModule {}
