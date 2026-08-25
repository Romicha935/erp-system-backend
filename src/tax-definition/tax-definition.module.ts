import { Module } from '@nestjs/common';
import { TaxDefinitionController } from './tax-definition.controller';
import { TaxDefinitionService } from './tax-definition.service';

@Module({
  controllers: [TaxDefinitionController],
  providers: [TaxDefinitionService]
})
export class TaxDefinitionModule {}
