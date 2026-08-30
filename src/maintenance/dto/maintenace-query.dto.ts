
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { MaintenanceStatusDto } from './update-maintenance.dto';

export class MaintenanceQueryDto {
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  status?: MaintenanceStatusDto;

  @IsOptional()
  @IsString()
  month?: string;

  @IsOptional()
  @IsString()
  year?: string;
}