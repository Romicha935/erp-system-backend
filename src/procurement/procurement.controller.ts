import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';



import { ProcurementService } from './procurement.service';

import { CreateProcurementDto } from './dto/create-procurement.dto';
import { ProcurementQueryDto } from './dto/procurement-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Request } from 'express';


@Controller('procurement')
@UseGuards(JwtAuthGuard)
export class ProcurementController {
  constructor(
    private readonly procurementService: ProcurementService,
  ) {}

  // POST /procurement

  @Post()
  create(
    @Body() dto: CreateProcurementDto,
    @Req() req: Request,
  ) {
    const userId = req.user['id'];

    return this.procurementService.create(
      dto,
      userId,
    );
  }

  // GET /procurement?page=1&limit=10

  @Get()
  findAll(
    @Query() query: ProcurementQueryDto,
  ) {
    return this.procurementService.findAll(
      query,
    );
  }

  // GET /procurement/metrics
  //
  // IMPORTANT:
  // এটা :id এর আগে রাখতে হবে।

  @Get('metrics')
  getMetrics() {
    return this.procurementService.getMetrics();
  }

  // GET /procurement/:id

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.procurementService.findOne(
      id,
    );
  }

  // PATCH /procurement/:id/action

  @Patch(':id/action')
  action(
    @Param('id', ParseUUIDPipe)
    id: string,

    @Body()
    dto: ProcurementActionDto,

    @Req() req: Request,
  ) {
    const userId = req.user['id'];

    return this.procurementService.action(
      id,
      dto,
      userId,
    );
  }
}