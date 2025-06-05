import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PetsModule } from './pets/pets.module';
import { QrService } from './qr/qr.service';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, PetsModule],
  providers: [QrService],
})
export class AppModule {}
