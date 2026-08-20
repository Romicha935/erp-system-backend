import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

enum AttachmentType {
  INVOICE = 'INVOICE',
  RECEIPT = 'RECEIPT',
}

export class CreateVoucherDto {
  @IsString()
  accountName: string;

  @IsString()
  accountNumber: string;

  @IsString()
  bankName: string;

  @IsUUID()
  @IsOptional()
  verifiedById?: string;

  @IsUUID()
  @IsOptional()
  approvedById?: string;
}

export class CreateProcurementDto {
  @IsString()
  item: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsUUID()
  sentToId: string;

  @IsBoolean()
  @IsOptional()
  hasAttachment?: boolean;

  @IsEnum(AttachmentType)
  @IsOptional()
  attachmentType?: AttachmentType;

  @IsString()
  @IsOptional()
  attachmentUrl?: string;

  @ValidateNested()
  @Type(() => CreateVoucherDto)
  @IsOptional()
  voucher?: CreateVoucherDto;
}