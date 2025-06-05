import {
  IsNumber,
  IsPositive,
  IsString,
  // IsUUID,
  MinLength,
} from 'class-validator';

export class CreatePetDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  @IsPositive()
  age: number;

  @IsString()
  @MinLength(1)
  species: string;

  @IsString()
  @MinLength(1)
  breed: string;

  @IsString()
  @MinLength(1)
  gender: string;

  @IsString()
  @MinLength(1)
  size: string;

  // @IsString()
  // @IsUUID()
  // ownerId: string;
}
