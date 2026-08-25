import { Module } from '@nestjs/common';
import { SalaryDefinitionController } from './salary-definition.controller';
import { SalaryDefinitionService } from './salary-definition.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SalaryDefinitionController],
  providers: [SalaryDefinitionService, PrismaService],
})
export class SalaryDefinitionModule {}
