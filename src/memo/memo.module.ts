import { Module } from '@nestjs/common';

import { MemoController } from './memo.controller';
import { MemoService } from './memo.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [
    NotificationModule,
  ],
  controllers: [MemoController],
  providers: [
    MemoService,
    PrismaService,
  ],
})
export class MemoModule {}