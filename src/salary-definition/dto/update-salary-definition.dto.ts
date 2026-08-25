import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSalaryDefinitionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsNumber()
  basicSalary?: number;

  @IsOptional()
  @IsNumber()
  housingAllowance?: number;

  @IsOptional()
  @IsNumber()
  transportAllowance?: number;

  @IsOptional()
  @IsNumber()
  utilityAllowance?: number;

  @IsOptional()
  @IsNumber()
  productivityAllowance?: number;

  @IsOptional()
  @IsNumber()
  communicationAllowance?: number;

  @IsOptional()
  @IsNumber()
  inconvenienceAllowance?: number;

  @IsOptional()
  @IsNumber()
  tax?: number;

  @IsOptional()
  @IsNumber()
  pension?: number;
}