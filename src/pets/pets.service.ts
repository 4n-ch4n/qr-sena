import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { QrService } from 'src/qr/qr.service';

@Injectable()
export class PetsService {
  private readonly logger = new Logger('PetsService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly qrService: QrService,
  ) {}

  async checkPetCode(petCode: string) {
    const petCodeEntity = await this.prisma.petCode.findFirst({
      where: {
        OR: [
          {
            id: petCode,
          },
          {
            code: petCode,
          },
        ],
      },
    });

    if (!petCodeEntity)
      throw new NotFoundException(`Code ${petCode} doesn't exists`);

    return petCodeEntity.claimed;
  }

  async create(createPetDto: CreatePetDto, user: User) {
    const { petCode: petCodeDto, ...petData } = createPetDto;

    const petCode = await this.prisma.petCode.findFirst({
      where: {
        OR: [
          {
            id: petCodeDto,
          },
          {
            code: petCodeDto,
          },
        ],
      },
    });

    if (!petCode || petCode.claimed)
      throw new BadRequestException('Code is invalid or already claimed');

    try {
      const pet = await this.prisma.pet.create({
        data: {
          ...petData,
          petCode_id: petCode.id,
          owner_id: user.id,
        },
      });

      await this.prisma.petCode.update({
        data: { claimed: true, claimed_at: new Date() },
        where: { id: petCode.id },
      });

      return pet;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit = 10, offset = 0 } = paginationDto;

    const pets = await this.prisma.pet.findMany({
      take: limit,
      skip: offset,
      where: { owner_id: user.id },
      include: {
        owner: {
          select: {
            name: true,
            last_name: true,
          },
        },
        petCode: {
          select: {
            id: true,
            code: true,
            claimed: true,
            claimed_at: true,
          },
        },
        lost_reports: {
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
        },
      },
    });

    return Promise.all(
      pets.map(async (pet) => ({
        ...pet,
        qr: await this.qrService.generateQrCode(pet.petCode.id),
      })),
    );
  }

  async findOne(term: string) {
    let pet: any;

    if (isUUID(term)) {
      pet = await this.prisma.pet.findUnique({
        where: { id: term },
        include: {
          owner: {
            select: {
              name: true,
              last_name: true,
            },
          },
          petCode: {
            select: {
              id: true,
              code: true,
              claimed: true,
              claimed_at: true,
            },
          },
          lost_reports: {
            orderBy: {
              created_at: 'desc',
            },
            take: 1,
          },
        },
      });
    } else {
      pet = await this.prisma.pet.findFirst({
        where: {
          name: term,
        },
        include: {
          owner: {
            select: {
              name: true,
              last_name: true,
            },
          },
          petCode: {
            select: {
              id: true,
              code: true,
              claimed: true,
              claimed_at: true,
            },
          },
          lost_reports: {
            orderBy: {
              created_at: 'desc',
            },
            take: 1,
          },
        },
      });
    }

    if (!pet) throw new NotFoundException(`Pet with ${term} not found`);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    return { pet, qr: await this.qrService.generateQrCode(pet.petCode.id) };
  }

  async findOneByPetCode(petCode: string) {
    const pet = await this.prisma.petCode.findFirst({
      where: {
        OR: [
          {
            id: petCode,
          },
          {
            code: petCode,
          },
        ],
      },
      include: {
        pet: true,
      },
    });

    if (!pet)
      throw new NotFoundException(`Pet with pet code ${petCode} not found`);

    return pet;
  }

  async update(id: string, updatePetDto: UpdatePetDto, user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { petCode, ...petData } = updatePetDto;

    const pet = await this.findOne(id);

    if (!pet) throw new NotFoundException(`Pet with id ${id} not found`);

    try {
      const updatedPet = await this.prisma.pet.update({
        where: {
          id,
          owner_id: user.id,
        },
        data: {
          ...petData,
        },
      });

      return updatedPet;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async remove(id: string) {
    const pet = await this.findOne(id);

    try {
      await this.prisma.pet.delete({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        where: { id: pet.pet.id },
      });
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
