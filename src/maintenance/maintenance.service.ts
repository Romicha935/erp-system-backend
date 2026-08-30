
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { MaintenanceQueryDto } from './dto/maintenace-query.dto';
;

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateMaintenanceDto) {
    const maintenance = await this.prisma.maintenance.create({
      data: {
        itemName: dto.itemName,
        quantity: dto.quantity,
        scheduledDate: new Date(dto.scheduledDate),
        maintenanceType: dto.maintenanceType,
        recurringOption: dto.recurringOption ?? null,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: { id: true, email: true, role: true },
        },
      },
    });

    return {
      message: 'Maintenance scheduled successfully',
      data: maintenance,
    };
  }

  async findAll(query: MaintenanceQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.itemName = { contains: query.search, mode: 'insensitive' };
    }

    if (query.month && query.year) {
      const start = new Date(Number(query.year), Number(query.month) - 1, 1);
      const end = new Date(Number(query.year), Number(query.month), 0, 23, 59, 59);
      where.scheduledDate = { gte: start, lte: end };
    }

    const [data, total] = await Promise.all([
      this.prisma.maintenance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { scheduledDate: 'asc' },
        include: {
          createdBy: {
            select: { id: true, email: true, role: true },
          },
        },
      }),

      this.prisma.maintenance.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, email: true, role: true },
        },
      },
    });

    if (!maintenance) {
      throw new NotFoundException('Maintenance record not found');
    }

    return { data: maintenance };
  }

  async update(id: string, dto: UpdateMaintenanceDto) {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: { id },
    });

    if (!maintenance) {
      throw new NotFoundException('Maintenance record not found');
    }

    const updated = await this.prisma.maintenance.update({
      where: { id },
      data: {
        status: dto.status,
        attachmentUrl: dto.attachmentUrl,
      },
      include: {
        createdBy: {
          select: { id: true, email: true, role: true },
        },
      },
    });

    return {
      message: 'Maintenance updated successfully',
      data: updated,
    };
  }

  async remove(id: string) {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: { id },
    });

    if (!maintenance) {
      throw new NotFoundException('Maintenance record not found');
    }

    await this.prisma.maintenance.delete({ where: { id } });

    return { message: 'Maintenance deleted successfully' };
  }
}