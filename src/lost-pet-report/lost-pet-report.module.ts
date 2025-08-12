import { Module } from '@nestjs/common';
import { LostPetReportService } from './lost-pet-report.service';
import { LostPetReportController } from './lost-pet-report.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  controllers: [LostPetReportController],
  providers: [LostPetReportService, PrismaService],
  imports: [AuthModule, MailerModule],
})
export class LostPetReportModule {}
