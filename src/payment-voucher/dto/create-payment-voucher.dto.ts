import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class BeneficiaryDto {
  @IsString()
  accountName: string;

  @IsString()
  accountNumber: string;

  @IsString()
  bankName: string;
}

export class CreatePaymentVoucherDto {
  @IsString()
  procurementId: string;

  @IsNumber()
  @IsOptional()
  vatPercentage?: number;

  @ValidateNested()
  @Type(() => BeneficiaryDto)
  beneficiary: BeneficiaryDto;

  @IsString()
  @IsOptional()
  remarks?: string;
}