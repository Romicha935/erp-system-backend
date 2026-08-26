import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateTaxDefinitionDto {
  @IsOptional()
  @IsString()
  taxType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  percentage?: number;
}