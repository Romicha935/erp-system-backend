// dto/create-inventory.dto.ts
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum InventoryTypeDto {
  STOCK = 'STOCK',
  INVENTORY = 'INVENTORY',
}

export class CreateInventoryItemDto {
  @IsEnum(InventoryTypeDto)
  type: InventoryTypeDto;

  @IsString()
  productName: string;

  @IsString()
  productId: string;

  @IsString()
  category: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  qtyPurchased: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsString()
  supplier: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantityInStock?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalUnits?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  functioningUnits?: number;
}