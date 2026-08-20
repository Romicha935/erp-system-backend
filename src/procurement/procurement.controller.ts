import { Body, Controller, Post, Req } from '@nestjs/common';

import { ProcurementService } from './procurement.service';
import { CreateProcurementDto } from './dto/create-procurement.dto';

@Controller('procurement')
export class ProcurementController {
  constructor(
    private readonly procurementService: ProcurementService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateProcurementDto,
    @Req() req: any,
  ) {
    return this.procurementService.create(
      dto,
      req.user.id,
    );
  }
}