import {
  IsEmail,
  IsMobilePhone,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  last_name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsMobilePhone()
  @MaxLength(10)
  phone: string;

  @IsString()
  @MinLength(8)
  @MaxLength(256)
  @IsStrongPassword()
  @Matches(
    /(?=.*[A-Z])(?=.*[a-z])(?:(?=.*\d)|(?=.*\W))^[^ñÑáéíóúÁÉÍÓÚ<>&"'/\s]*$/,
    {
      message:
        'La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un caracter especial y un número ademas no puede tener espacios ni letra "ñ.',
    },
  )
  password: string;
}
