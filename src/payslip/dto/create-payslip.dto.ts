import {
  IsInt,
  IsNumber,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreatePayslipDto {
  @IsUUID()
  staffId: string;

  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsInt()
  year: number;

  @IsNumber()
  tax?: number;

  @IsNumber()
  pension?: number;
}