import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePayrollItemDto {
  @IsString()
  staffId: string;
}

export class CreatePayrollDto {
  @IsString()
  paymentName: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsInt()
  year: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePayrollItemDto)
  items: CreatePayrollItemDto[];
}