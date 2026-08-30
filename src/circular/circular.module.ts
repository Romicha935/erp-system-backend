import { Module } from '@nestjs/common';
import { CircularController } from './circular.controller';
import { CircularService } from './circular.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CircularController],
  providers: [CircularService, PrismaService]
})
export class CircularModule {}
