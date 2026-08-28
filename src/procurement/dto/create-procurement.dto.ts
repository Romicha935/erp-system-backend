import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AttachmentType } from 'src/common/enums';





export class CreateProcurementDto {
  @IsString()
  item: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  totalPrice: number;

  @IsString()
  requestedById: string;

  @IsString()
  sentToId: string;

  @IsBoolean()
  @IsOptional()
  hasAttachment?: boolean;

  @IsOptional()
  attachmentType?: AttachmentType;

  @IsString()
  @IsOptional()
  attachmentUrl?: string;
}