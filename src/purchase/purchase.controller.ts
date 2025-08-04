import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDTO } from './dto/create-purchase.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateShippingDTO } from './dto/update-shipping.dto';
import { Response } from 'express';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @Auth(ValidRoles.user)
  checkout(
    @Body() createPurchaseDTO: CreatePurchaseDTO,
    @GetUser() user: User,
  ) {
    return this.purchaseService.checkout(createPurchaseDTO, user);
  }

  @Get()
  @Auth(ValidRoles.user)
  findAll(@Query() paginationDto: PaginationDto, @GetUser() user: User) {
    return this.purchaseService.findAll(paginationDto, user);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.purchaseService.findOne(id);
  }

  @Get('status/:status')
  @Auth(ValidRoles.admin)
  findByStatus(
    @Param('status') status: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.purchaseService.findByStatus(
      status.toUpperCase(),
      paginationDto,
    );
  }

  @Patch('ship/:id')
  @Auth(ValidRoles.admin)
  shipPurchase(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateShippingDto: UpdateShippingDTO,
  ) {
    return this.purchaseService.shipPurchase(id, updateShippingDto);
  }

  @Patch('complete-shipping/:id')
  @Auth(ValidRoles.admin)
  completeShipping(@Param('id', ParseUUIDPipe) id: string) {
    return this.purchaseService.completeShipping(id);
  }

  @Get('report/:purchaseId')
  @Auth()
  async getPurchaseReport(
    @Res() response: Response,
    @Param('purchaseId', ParseUUIDPipe) purchaseId: string,
  ) {
    const pdfDoc =
      await this.purchaseService.getPurchaseReportByPurchaseId(purchaseId);

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Factura';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
