import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';

@Module({
  controllers: [StaffController],
  providers: [StaffService]
})
export class StaffModule {}
