import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StaffModule } from './staff/staff.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProcurementModule } from './procurement/procurement.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    StaffModule,
    ProcurementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}