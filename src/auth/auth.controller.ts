import { Controller, Get, Post, Body, Patch, Query } from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateProfileDTO,
  ResetPasswordDTO,
} from './dto';
import { Auth, GetUser } from './decorators';
import { ValidRoles } from './interfaces';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

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

  @Patch('update-profile')
  @Auth()
  updateProfile(
    @GetUser() user: User,
    @Body() updateProfileDto: UpdateProfileDTO,
  ) {
    return this.authService.updateProfile(user.id, updateProfileDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Patch('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDTO) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('users')
  @Auth(ValidRoles.admin)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.authService.findAll(paginationDto);
  }
}
