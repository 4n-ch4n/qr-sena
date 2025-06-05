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
import { Pet, User } from '@prisma/client';
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

  async create(createPetDto: CreatePetDto, user: User) {
    try {
      const pet = await this.prisma.pet.create({
        data: {
          ...createPetDto,
          owner_id: user.id,
        },
      });

      const qrCode = await this.qrService.generateQrCode(
        `http://sitio-wb.com/pets/${pet.id}`,
      );

      const updatedPet = await this.prisma.pet.update({
        where: { id: pet.id },
        data: { qrCode },
      });

      return updatedPet;
    } catch (error) {
      this.handldeDbErrors(error);
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
      },
    });

    return pets;
  }

  async findOne(term: string) {
    let pet: Pet | null;

    if (isUUID(term)) {
      pet = await this.prisma.pet.findUnique({ where: { id: term } });
    } else {
      pet = await this.prisma.pet.findFirst({
        where: {
          name: term,
        },
      });
    }

    if (!pet) throw new NotFoundException(`Pet with ${term} not found`);

    return pet;
  }

  async update(id: string, updatePetDto: UpdatePetDto, user: User) {
    try {
      await this.prisma.pet.update({
        where: {
          id,
          owner_id: user.id,
        },
        data: {
          ...updatePetDto,
        },
      });

      return this.findOne(id);
    } catch (error) {
      this.handldeDbErrors(error);
    }
  }

  async remove(id: string) {
    const pet = await this.findOne(id);

    await this.prisma.pet.delete({
      where: { id: pet.id },
    });
  }

  private handldeDbErrors(error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === '23505') throw new BadRequestException(error.detail);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.dode === '22P02') throw new NotFoundException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
