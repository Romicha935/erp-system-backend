
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum MaintenanceTypeDto {
  RECURRING = 'RECURRING',
  ONE_TIME = 'ONE_TIME',
}

export class CreateMaintenanceDto {
  @IsString()
  itemName: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsDateString()
  scheduledDate: string;

  @IsEnum(MaintenanceTypeDto)
  maintenanceType: MaintenanceTypeDto;

  @IsOptional()
  @IsString()
  recurringOption?: string;
}