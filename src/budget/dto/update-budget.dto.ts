
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export enum BudgetStatusDto {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class UpdateBudgetDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  actualAmount?: number;

  @IsOptional()
  @IsEnum(BudgetStatusDto)
  status?: BudgetStatusDto;
}