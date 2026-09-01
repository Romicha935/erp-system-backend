
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

import { TrainingService } from './training.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingStatusDto } from './dto/update-training-status.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { TrainingQueryDto } from './dto/trainng-query.dto';

@Controller('trainings')
@UseGuards(JwtAuthGuard)
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateTrainingDto) {
    return this.trainingService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Query() query: TrainingQueryDto) {
    return this.trainingService.findAll(query);
  }

  @Get('summary')
  getSummary() {
    return this.trainingService.getSummary();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTrainingStatusDto) {
    return this.trainingService.updateStatus(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingService.remove(id);
  }
}