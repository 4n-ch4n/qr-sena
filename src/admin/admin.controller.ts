import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('generate-codes/:numberCodes')
  @Auth(ValidRoles.admin)
  generateQrCodes(@Param('numberCodes', ParseIntPipe) numberCodes: number) {
    return this.adminService.generateQrCodes(numberCodes);
  }

  @Get('generated-codes/:numberCodes')
  @Auth(ValidRoles.admin)
  getGeneratedQrCodes(@Param('numberCodes', ParseIntPipe) numberCodes: number) {
    return this.adminService.getGeneratedQrCodes(numberCodes);
  }
}
