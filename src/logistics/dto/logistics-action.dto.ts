
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum LogisticsAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

export class LogisticsActionDto {
  @IsEnum(LogisticsAction)
  action: LogisticsAction;

  @IsOptional()
  @IsString()
  remarks?: string;
}