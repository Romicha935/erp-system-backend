import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

import { SalaryDefinitionService } from './salary-definition.service';
import { CreateSalaryDefinitionDto } from './dto/create-salary-definition.dto';

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
}