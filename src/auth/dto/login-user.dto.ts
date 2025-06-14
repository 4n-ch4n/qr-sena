import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(256)
  @IsStrongPassword()
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z])(?!.*[\sñÑáéíóúÁÉÍÓÚ]).*$/,
    {
      message:
        'La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un caracter especial y un número ademas no puede tener espacios ni letra "ñ.',
    },
  )
  password: string;
}
