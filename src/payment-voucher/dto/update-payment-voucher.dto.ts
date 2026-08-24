import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePaymentVoucherDto {
  @IsOptional()
  @IsNumber()
  vatPercentage?: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  accountName?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  bankName?: string;
}