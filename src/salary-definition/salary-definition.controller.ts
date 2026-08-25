import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

import { SalaryDefinitionService } from './salary-definition.service';
import { CreateSalaryDefinitionDto } from './dto/create-salary-definition.dto';
import { UpdateSalaryDefinitionDto } from './dto/update-salary-definition.dto';

@Controller('salary-definition')
@UseGuards(JwtAuthGuard)
export class SalaryDefinitionController {
  constructor(
    private readonly salaryDefinitionService: SalaryDefinitionService,
  ) {}

  @Post()
  create(@Body() dto: CreateSalaryDefinitionDto) {
    return this.salaryDefinitionService.create(dto);
  }

  @Get()
findAll() {
  return this.salaryDefinitionService.findAll();
}

@Patch(':id')
update(
  @Param('id') id: string,
  @Body() dto: UpdateSalaryDefinitionDto,
) {
  return this.salaryDefinitionService.update(id, dto);
}

@Delete(':id')
remove(@Param('id') id: string) {
  return this.salaryDefinitionService.remove(id);
}
}