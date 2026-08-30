
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum CircularType {
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
}

export class CircularQueryDto {
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
  @IsEnum(CircularType)
  type?: CircularType;
}