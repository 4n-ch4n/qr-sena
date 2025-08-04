import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma.service';
import { CreateUserDto, LoginUserDto, UpdateProfileDTO } from './dto';
import type { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user: User = await this.prisma.user.create({
        data: {
          ...userData,
          password: bcrypt.hashSync(password, 10),
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: userPassword, ...restUser } = user;

      return {
        user: { ...restUser },
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new UnauthorizedException('Credenciales incorrectas');
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales incorrectas');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...restUser } = user;

    return {
      user: { ...restUser },
      token: this.getJwtToken({ id: user.id }),
    };
  }

  checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDTO) {
    const { lastName, name, phone } = updateProfileDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new BadRequestException('User not found');

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          name,
          last_name: lastName,
          phone,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...restUser } = updatedUser;

      return restUser;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any) {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    if (error.code === '23505') throw new BadRequestException(error.detail);

    if (error.code === 'P2002')
      throw new BadRequestException('Un usario con ese email ya existe');

    console.log(error);

    throw new InternalServerErrorException('Check server logs');
  }
}
