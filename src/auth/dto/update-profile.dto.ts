import {
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateProfileDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  @IsMobilePhone()
  @Length(10, 10)
  @IsOptional()
  phone?: string;
}
