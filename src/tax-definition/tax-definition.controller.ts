import {
  Body,
  Controller,
  Get,
  Post,
  Query,
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

  @Get()
findAll(
  @Query('page') page = '1',
  @Query('limit') limit = '10',
  @Query('search') search?: string,
) {
  return this.taxDefinitionService.findAll(
    Number(page),
    Number(limit),
    search,
  );
}
}