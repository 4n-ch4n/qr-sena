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
import { User } from '@prisma/client';

@Injectable()
export class LostPetReportService {
  private readonly logger = new Logger('PetsService');

  constructor(private readonly prisma: PrismaService) {}

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
        pet: true,
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

  async foundPet(petId: string, user: User) {
    const report = await this.reportByPetId(petId);
    if (!report.is_active)
      throw new BadRequestException('Pet not reported as lost');

    if (!report) throw new NotFoundException('Report not found');

    if (user.id !== report.pet?.owner_id)
      throw new BadRequestException('You can only mark your own pet as found');

    try {
      const updatedReport = await this.prisma.lostPetReport.update({
        where: {
          id: report.id!,
        },
        data: {
          is_active: false,
        },
      });

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
