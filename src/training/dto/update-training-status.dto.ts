
import { IsEnum } from 'class-validator';

export enum TrainingStatusDto {
  TODO = 'TODO',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
}

export class UpdateTrainingStatusDto {
  @IsEnum(TrainingStatusDto)
  status: TrainingStatusDto;
}