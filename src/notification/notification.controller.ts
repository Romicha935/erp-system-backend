// notification.controller.ts
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

import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationService.create(dto);
  }

  @Get()
  findAll(@Req() req, @Query() query: NotificationQueryDto) {
    return this.notificationService.findAll(req.user.id, query);
  }

  @Patch('read-all')
  markAllAsRead(@Req() req) {
    return this.notificationService.markAllAsRead(req.user.id);
  }

  @Patch(':id/read')
  markAsRead(@Req() req, @Param('id') id: string) {
    return this.notificationService.markAsRead(req.user.id, id);
  }

  @Delete('all')
  removeAll(@Req() req) {
    return this.notificationService.removeAll(req.user.id);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.notificationService.remove(req.user.id, id);
  }
}