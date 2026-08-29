import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum MemoAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

export class MemoActionDto {
  @IsEnum(MemoAction)
  action: MemoAction;

  @IsOptional()
  @IsString()
  remarks?: string;
} 