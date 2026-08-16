import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto/create-staff.dto';


@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  async createStaff(dto: CreateStaffDto) {
    return this.prisma.staff.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        email: dto.email,
        officialEmail: dto.officialEmail,
        gender: dto.gender,
        profileImage: dto.profileImage,
        role: dto.role,
        designation: dto.designation,
        staffId: dto.staffId,
      },
    });
  }
}