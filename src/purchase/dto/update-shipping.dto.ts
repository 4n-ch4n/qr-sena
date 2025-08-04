import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateShippingDTO {
  @IsString()
  @IsNotEmpty()
  carrier: string;

  @IsString()
  @IsNotEmpty()
  trackingCode: string;
}
