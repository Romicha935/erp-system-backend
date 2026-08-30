
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  budgetNo: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  budgetedAmount: number;

  @IsOptional()
  @IsString()
  receivingOffice?: string;
}