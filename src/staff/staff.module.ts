import { Module } from '@nestjs/common';

import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [
    NotificationModule,
  ],
  controllers: [StaffController],
  providers: [StaffService],
})
export class StaffModule {}