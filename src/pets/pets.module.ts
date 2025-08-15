import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { QrService } from 'src/qr/qr.service';

@Module({
  controllers: [PetsController],
  providers: [PetsService, PrismaService, QrService],
  imports: [AuthModule],
  exports: [PetsService],
})
export class PetsModule {}
