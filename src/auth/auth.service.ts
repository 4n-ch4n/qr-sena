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
import { CreateUserDto, LoginUserDto } from './dto';
import { QrService } from 'src/qr/qr.service';
import type { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly qrService: QrService,
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

  async generateQrCodes(numberCodes: number) {
    const qrs: {
      qr: string;
      code: string;
    }[] = [];

    for (let i = 0; i < numberCodes; i++) {
      const element = await this.generateQrCode();
      qrs.push(element);
    }

    return qrs;
  }

  async getGeneratedQrCodes(numberCodes: number) {
    const petCodes = await this.prisma.petCode.findMany({
      take: numberCodes,
      where: { claimed: false },
    });

    const qrs = petCodes.map(async (petCode) => ({
      qr: await this.qrService.generateQrCode(petCode.id),
      code: petCode.code,
    }));

    return Promise.all(qrs);
  }

  private async generateQrCode() {
    const code = Math.random().toString(36).substring(2, 8);

    const petCode = await this.prisma.petCode.create({ data: { code } });

    const qr = await this.qrService.generateQrCode(petCode.id);

    return {
      qr,
      code: petCode.code,
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any) {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    if (error.code === '23505') throw new BadRequestException(error.detail);

    if (error.code === 'P2002')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new BadRequestException('Email ya existe', error.details);

    console.log(error);

    throw new InternalServerErrorException('Check server logs');
  }
}
