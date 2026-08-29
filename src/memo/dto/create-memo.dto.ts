import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateMemoDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsUUID()
  receiverId: string;

  @IsOptional()
  @IsBoolean()
  hasAttachment?: boolean;

  @IsOptional()
  @IsString()
  attachmentType?: string;

  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}