import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { PlateDTO } from './plate.dto';

export class CreatePurchaseDTO {
  @IsArray()
  @IsNotEmpty()
  items: PlateDTO[];

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;
}
