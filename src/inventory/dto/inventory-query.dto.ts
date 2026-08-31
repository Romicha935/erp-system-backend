// dto/inventory-query.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { InventoryTypeDto } from './create-inventory.dto';


export class InventoryQueryDto {
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
  @IsEnum(InventoryTypeDto)
  type?: InventoryTypeDto;

  @IsOptional()
  @IsString()
  category?: string;
}