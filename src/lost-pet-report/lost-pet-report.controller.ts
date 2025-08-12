import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { LostPetReportService } from './lost-pet-report.service';
import { CreateLostPetReportDto } from './dto/create-lost-pet-report.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('lost-pet-report')
export class LostPetReportController {
  constructor(private readonly lostPetReportService: LostPetReportService) {}

  @Post()
  reportLost(@Body() createLostPetReportDto: CreateLostPetReportDto) {
    return this.lostPetReportService.reportLost(createLostPetReportDto);
  }

  @Get()
  @Auth(ValidRoles.admin)
  reportsHistory(@Query() paginationDto: PaginationDto) {
    return this.lostPetReportService.reportsHistory(paginationDto);
  }

  @Get('status/:id')
  reportByPetId(@Param('id', ParseUUIDPipe) petId: string) {
    return this.lostPetReportService.reportByPetId(petId);
  }

  @Patch('found/:petId')
  @Auth(ValidRoles.admin)
  foundPet(@Param('petId', ParseUUIDPipe) petId: string) {
    return this.lostPetReportService.foundPet(petId);
  }
}
