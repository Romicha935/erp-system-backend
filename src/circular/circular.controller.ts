// circular.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CircularService } from './circular.service';
import { CreateCircularDto } from './dto/create-circular.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CircularQueryDto } from './dto/circular-query.dt';

@Controller('circulars')
@UseGuards(JwtAuthGuard)
export class CircularController {
  constructor(private readonly circularService: CircularService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateCircularDto) {
    return this.circularService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req, @Query() query: CircularQueryDto) {
    return this.circularService.findAll(req.user.id, query);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.circularService.findOne(req.user.id, id);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.circularService.remove(req.user.id, id);
  }
}