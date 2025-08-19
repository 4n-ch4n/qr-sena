import {
  IsArray,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { PlateDTO } from './plate.dto';

export class CreatePurchaseDTO {
  @IsArray()
  @IsNotEmpty()
  items: PlateDTO[];

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsNotEmpty()
  @IsMobilePhone()
  @Length(10, 10)
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
