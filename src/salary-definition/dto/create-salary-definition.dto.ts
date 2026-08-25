import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateSalaryDefinitionDto {
  @IsUUID()
  staffId: string;

  @IsNumber()
  @Min(0)
  basicSalary: number;

  @IsNumber()
  @Min(0)
  housingAllowance: number;

  @IsNumber()
  @Min(0)
  transportAllowance: number;

  @IsNumber()
  @Min(0)
  utilityAllowance: number;

  @IsNumber()
  @Min(0)
  productivityAllowance: number;

  @IsNumber()
  @Min(0)
  communicationAllowance: number;

  @IsNumber()
  @Min(0)
  inconvenienceAllowance: number;

  @IsNumber()
  @Min(0)
  deductions: number;
}