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

import { PayrollService } from './payroll.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';


@Controller('payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  // CREATE
  @Post()
  create(@Body() dto: CreatePayrollDto) {
    return this.payrollService.create(dto);
  }

  // GET ALL
  @Get()
  findAll() {
    return this.payrollService.findAll();
  }

  // GET SINGLE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payrollService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.payrollService.update(id, dto);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payrollService.remove(id);
  }
}