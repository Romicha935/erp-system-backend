import { IsNumber, IsString, Min } from 'class-validator';

export class CreateTaxDefinitionDto {
  @IsString()
  taxType: string;

  @IsNumber()
  @Min(0)
  percentage: number;
}