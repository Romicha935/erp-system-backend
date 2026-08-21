import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ProcurementService } from './procurement.service';
import { CreateProcurementDto } from './dto/create-procurement.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('procurement')
@UseGuards(JwtAuthGuard)
export class ProcurementController {
  constructor(
    private readonly procurementService: ProcurementService,
  ) {}

  // CREATE
  @Post()
  create(@Body() dto: CreateProcurementDto) {
    return this.procurementService.create(dto);
  }

  // GET ALL
  @Get()
  findAll() {
    return this.procurementService.findAll();
  }

  // GET SINGLE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.procurementService.findOne(id);
  }
}