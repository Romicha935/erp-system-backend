
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { LogisticsService } from './logistics.service';
import { CreateLogisticsDto } from './dto/create-logistics.dto';
import { LogisticsActionDto } from './dto/logistics-action.dto';
import { LogisticsQueryDto } from './dto/logistics-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('logistics')
@UseGuards(JwtAuthGuard)
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateLogisticsDto) {
    return this.logisticsService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Query() query: LogisticsQueryDto) {
    return this.logisticsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logisticsService.findOne(id);
  }

  @Patch(':id/action')
  action(@Param('id') id: string, @Body() dto: LogisticsActionDto) {
    return this.logisticsService.action(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logisticsService.remove(id);
  }
}