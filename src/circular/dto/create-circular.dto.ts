
import { IsIn, IsString } from 'class-validator';

export const CIRCULAR_GROUPS = [
  'Operations Staffs',
  'HR Staffs',
  'All Staff',
] as const;

export class CreateCircularDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsIn(CIRCULAR_GROUPS)
  sentToGroup: string;
}