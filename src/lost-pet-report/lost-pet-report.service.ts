import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateLostPetReportDto } from './dto/create-lost-pet-report.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class LostPetReportService {
  private readonly logger = new Logger('PetsService');

  constructor(
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
  ) {}

  async reportLost(createLostPetReportDto: CreateLostPetReportDto) {
    const { petId, message, location } = createLostPetReportDto;

    const latestReport = await this.reportByPetId(petId);

    if (latestReport.is_active)
      throw new BadRequestException('Pet already reported as lost');

    try {
      const report = await this.prisma.lostPetReport.create({
        data: {
          pet_id: petId,
          message,
          location,
        },
      });

      return report;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async reportsHistory(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const reports = await this.prisma.lostPetReport.findMany({
      orderBy: {
        created_at: 'desc',
      },
      include: {
        pet: true,
      },
      take: limit,
      skip: offset,
    });

    return reports;
  }

  async reportByPetId(petId: string) {
    const report = await this.prisma.lostPetReport.findFirst({
      where: {
        pet_id: petId,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            age: true,
            species: true,
            breed: true,
            gender: true,
            size: true,
            image: true,
            owner: {
              select: {
                id: true,
                name: true,
                last_name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      return {
        id: null,
        pet_id: petId,
        is_active: false,
        message: null,
        location: null,
        created_at: null,
        pet: null,
      };
    }

    return report;
  }

  async foundPet(petId: string) {
    const report = await this.reportByPetId(petId);
    if (!report.is_active)
      throw new BadRequestException('Pet not reported as lost');

    if (!report) throw new NotFoundException('Report not found');

    if (!report.pet?.owner.email) throw new BadRequestException();

    try {
      const updatedReport = await this.prisma.lostPetReport.update({
        where: {
          id: report.id,
        },
        data: {
          is_active: false,
        },
      });

      await this.mailerService.sendFoundPetNotification(
        {
          to: report.pet?.owner.email,
          subject: 'Tu mascota ha sido encontrada',
        },
        {
          petName: report.pet?.name,
          ownerName: report.pet?.owner.name,
          ownerPhone: report.pet?.owner.phone,
        },
      );

      return updatedReport;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  private handleDbErrors(error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === '23505') throw new BadRequestException(error.detail);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === '22P02') throw new NotFoundException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
