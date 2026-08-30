
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum MaintenanceStatusDto {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
}

export class UpdateMaintenanceDto {
  @IsOptional()
  @IsEnum(MaintenanceStatusDto)
  status?: MaintenanceStatusDto;

  @IsOptional()
  @IsString()
  attachmentUrl?: string;
}