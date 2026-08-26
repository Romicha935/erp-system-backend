import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { TaxDefinitionService } from './tax-definition.service';
import { CreateTaxDefinitionDto } from './dto/create-tax-definition.dto';
import { UpdateTaxDefinitionDto } from './dto/update-tax-definition.dto';

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

@Get(':id')
findOne(@Param('id') id: string) {
  return this.taxDefinitionService.findOne(id);
}

@Patch(':id')
update(
  @Param('id') id: string,
  @Body() dto: UpdateTaxDefinitionDto,
) {
  return this.taxDefinitionService.update(id, dto);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taxDefinitionService.remove(id);
  }
}