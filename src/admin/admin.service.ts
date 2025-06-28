import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { QrService } from 'src/qr/qr.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qrService: QrService,
  ) {}

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

  async getDashboardStats() {
    const totalPets = await this.prisma.pet.count();
    const petsByType = await this.prisma.pet.groupBy({
      by: 'species',
      _count: true,
    });

    const qrGenerated = await this.prisma.petCode.count();
    const qrClaimed = await this.prisma.petCode.count({
      where: {
        claimed: true,
      },
    });

    const totalActiveUsers = await this.prisma.user.count({
      where: {
        is_active: true,
      },
    });

    return {
      totalPets,
      qrGenerated,
      qrClaimed,
      petsByType,
      totalActiveUsers,
    };
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
}
