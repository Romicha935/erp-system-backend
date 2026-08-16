import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { UserRole } from 'generated/prisma/enums';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { CreateStaffDto } from './dto/create-staff.dto/create-staff.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';



@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  createStaff(@Body() dto: CreateStaffDto) {
    return this.staffService.createStaff(dto);
  }
}