import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { TaxDefinitionService } from './tax-definition.service';
import { CreateTaxDefinitionDto } from './dto/create-tax-definition.dto';

@Controller('tax-definition')
export class TaxDefinitionController {
  constructor(
    private readonly taxDefinitionService: TaxDefinitionService,
  ) {}

  @Post()
  create(@Body() dto: CreateTaxDefinitionDto) {
    return this.taxDefinitionService.create(dto);
  }
}