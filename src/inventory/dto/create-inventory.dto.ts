
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

  @IsInt()
  @Min(0)
  qtyPurchased: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsString()
  supplier: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantityInStock?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalUnits?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  functioningUnits?: number;
}