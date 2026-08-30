// dto/create-logistics.dto.ts
import { IsDateString, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateLogisticsDto {
  @IsString()
  title: string;

  @IsString()
  purpose: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsUUID()
  requestedById: string;

  @IsUUID()
  sentToId: string;

  @IsDateString()
  dateFrom: string;

  @IsDateString()
  dateTo: string;

  @IsString()
  accountName: string;

  @IsString()
  accountNumber: string;

  @IsString()
  bankName: string;
}