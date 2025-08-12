import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get('pet-code/:code')
  getCode(@Param('code') petCode: string) {
    return this.petsService.checkPetCode(petCode);
  }

  @Post()
  @Auth(ValidRoles.user)
  create(@Body() createPetDto: CreatePetDto, @GetUser() user: User) {
    return this.petsService.create(createPetDto, user);
  }

  @Get()
  @Auth(ValidRoles.user)
  findAll(@Query() paginationDto: PaginationDto, @GetUser() user: User) {
    return this.petsService.findAll(paginationDto, user);
  }

  @Get('admin')
  @Auth(ValidRoles.admin)
  findAllAdmin(@Query() paginationDto: PaginationDto) {
    return this.petsService.findAllAdmin(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.petsService.findOne(term);
  }

  @Get('code/:petCode')
  findOneByPetCode(@Param('petCode') petCode: string) {
    return this.petsService.findOneByPetCode(petCode);
  }

  @Patch(':id')
  @Auth(ValidRoles.user)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePetDto: UpdatePetDto,
    @GetUser() user: User,
  ) {
    return this.petsService.update(id, updatePetDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.user, ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.petsService.remove(id);
  }
}
