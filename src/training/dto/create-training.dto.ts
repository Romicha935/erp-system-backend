
import { IsArray, IsDateString, IsInt, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTrainingDto {
  @IsString()
  description: string;

  @IsString()
  type: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationValue: number;

  @IsString()
  durationUnit: string;

  @IsDateString()
  startDate: string;

  @IsString()
  mode: string;

  @IsArray()
  @IsUUID('4', { each: true })
  participantIds: string[];
}