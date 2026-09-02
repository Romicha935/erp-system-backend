// profile.module.ts
import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SettingService } from './setting.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}