import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { StaffService } from './staff.service';






import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { CreateStaffDto } from './dto/create-staff.dto/create-staff.dto';
import { StaffQueryDto } from './dto/create-staff.dto/staff-query.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UserRole } from 'generated/prisma';

@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
  ) {}

  // POST /staff
  @Post()
  createStaff(@Body() dto: CreateStaffDto) {
    return this.staffService.createStaff(dto);
  }

  // GET /staff
  @Get()
  getStaff(@Query() query: StaffQueryDto) {
    return this.staffService.getStaff(query);
  }

  // GET /staff/:id
  @Get(':id')
  getStaffById(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.staffService.getStaffById(id);
  }

  // PATCH /staff/:id
  @Patch(':id')
  updateStaff(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStaffDto,
  ) {
    return this.staffService.updateStaff(id, dto);
  }

  // DELETE /staff/:id
  @Delete(':id')
  deleteStaff(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.staffService.deleteStaff(id);
  }
}