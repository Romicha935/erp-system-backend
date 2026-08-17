import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffDto } from './create-staff.dto/create-staff.dto';


export class UpdateStaffDto extends PartialType(CreateStaffDto) {}