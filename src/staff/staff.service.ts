import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';






import { CreateStaffDto } from './dto/create-staff.dto/create-staff.dto';
import { StaffQueryDto } from './dto/create-staff.dto/staff-query.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}


  async createStaff(dto: CreateStaffDto) {
    const existingStaff = await this.prisma.staff.findFirst({
      where: {
        OR: [
          { staffId: dto.staffId },
          { email: dto.email },
          ...(dto.officialEmail
            ? [{ officialEmail: dto.officialEmail }]
            : []),
        ],
      },
    });

    if (existingStaff) {
      throw new ConflictException(
        'Staff ID or email already exists',
      );
    }

    return this.prisma.staff.create({
      data: {
        staffId: dto.staffId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        email: dto.email,
        officialEmail: dto.officialEmail,
        gender: dto.gender,
        profileImage: dto.profileImage,
        role: dto.role,
        designation: dto.designation,
      },
    });
  }

  // ==========================================
  // GET ALL STAFF
  // SEARCH + ROLE FILTER + PAGINATION
  // ==========================================

  async getStaff(query: StaffQueryDto) {
    const {
      search,
      role,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.StaffWhereInput = {};

    // Search
    if (search) {
      where.OR = [
        {
          firstName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          staffId: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          designation: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Role filter
    if (role) {
      where.role = role;
    }

    const [staff, total] = await Promise.all([
      this.prisma.staff.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          staffId: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          officialEmail: true,
          gender: true,
          profileImage: true,
          role: true,
          designation: true,
          createdAt: true,
          updatedAt: true,
        },
      }),

      this.prisma.staff.count({
        where,
      }),
    ]);

    return {
      data: staff,

      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ==========================================
  // GET SINGLE STAFF
  // ==========================================

  async getStaffById(id: string) {
    const staff = await this.prisma.staff.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        staffId: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        officialEmail: true,
        gender: true,
        profileImage: true,
        role: true,
        designation: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    return staff;
  }

  // ==========================================
  // UPDATE STAFF
  // ==========================================

  async updateStaff(id: string, dto: UpdateStaffDto) {
    const staff = await this.prisma.staff.findUnique({
      where: { id },
    });

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    // Check duplicate fields
    if (
      dto.staffId ||
      dto.email ||
      dto.officialEmail
    ) {
      const duplicate = await this.prisma.staff.findFirst({
        where: {
          AND: [
            {
              id: {
                not: id,
              },
            },
            {
              OR: [
                ...(dto.staffId
                  ? [{ staffId: dto.staffId }]
                  : []),

                ...(dto.email
                  ? [{ email: dto.email }]
                  : []),

                ...(dto.officialEmail
                  ? [{ officialEmail: dto.officialEmail }]
                  : []),
              ],
            },
          ],
        },
      });

      if (duplicate) {
        throw new ConflictException(
          'Staff ID or email already exists',
        );
      }
    }

    return this.prisma.staff.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  // ==========================================
  // DELETE STAFF
  // ==========================================

  async deleteStaff(id: string) {
    const staff = await this.prisma.staff.findUnique({
      where: {
        id,
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    await this.prisma.staff.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Staff deleted successfully',
    };
  }
}