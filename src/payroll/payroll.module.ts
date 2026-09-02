import { Module } from '@nestjs/common';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [NotificationModule],
  controllers: [PayrollController],
  providers: [PayrollService]
})
export class PayrollModule {}
