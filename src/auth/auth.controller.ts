import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UpdateProfileDTO } from './dto';
import { Auth, GetUser } from './decorators';

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
}
