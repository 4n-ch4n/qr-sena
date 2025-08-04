import { PlateType } from '@prisma/client';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class PlateDTO {
  @IsIn(['SMALL', 'MEDIUM', 'LARGE'])
  type: PlateType;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nameToEngrave?: string;
}
