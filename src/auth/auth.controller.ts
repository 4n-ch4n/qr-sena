import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser } from './decorators';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('generate-codes/:numberCodes')
  @Auth(ValidRoles.admin)
  generateQrCodes(@Param('numberCodes', ParseIntPipe) numberCodes: number) {
    return this.authService.generateQrCodes(numberCodes);
  }

  @Get('generated-codes/:numberCodes')
  @Auth(ValidRoles.admin)
  getGeneratedQrCodes(@Param('numberCodes', ParseIntPipe) numberCodes: number) {
    return this.authService.getGeneratedQrCodes(numberCodes);
  }
}
