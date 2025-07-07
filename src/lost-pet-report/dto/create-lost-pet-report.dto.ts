import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateLostPetReportDto {
  @IsUUID()
  @IsString()
  petId: string;

  @IsString()
  @IsOptional()
  message: string;

  @IsString()
  @IsOptional()
  location: string;
}
