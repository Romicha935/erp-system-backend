import { Module } from '@nestjs/common';

import { ProcurementController } from './procurement.controller';
import { ProcurementService } from './procurement.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProcurementController],

  providers: [
    ProcurementService,
    PrismaService,
  ],
})
export class ProcurementModule {}