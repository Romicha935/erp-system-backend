// logistics.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLogisticsDto } from './dto/create-logistics.dto';

import { LogisticsQueryDto } from './dto/logistics-query.dto';
import { LogisticsActionDto, LogisticsAction  } from './dto/logistics-action.dto';

@Injectable()
export class LogisticsService {
  constructor(private readonly prisma: PrismaService) {}

 async create(userId: string, dto: CreateLogisticsDto) {
  const logistics = await this.prisma.logisticsRequest.create({
    data: {
      title: dto.title,
      purpose: dto.purpose,
      amount: dto.amount,
      dateFrom: new Date(dto.dateFrom),
      dateTo: new Date(dto.dateTo),
      requestedById: dto.requestedById,
      sentToId: dto.sentToId,
      beneficiary: {
        create: {
          accountName: dto.accountName,
          accountNumber: dto.accountNumber,
          bankName: dto.bankName,
        },
      },
    },
    include: {
      requestedBy: {
        select: { id: true, staffId: true, firstName: true, lastName: true },
      },
      sentTo: {
        select: { id: true, staffId: true, firstName: true, lastName: true },
      },
      beneficiary: true,
    },
  });

  return {
    message: 'Logistics request created successfully',
    data: logistics,
  };
}

  async findAll(query: LogisticsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.logisticsRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          requestedBy: {
            select: { id: true, staffId: true, firstName: true, lastName: true },
          },
          sentTo: {
            select: { id: true, staffId: true, firstName: true, lastName: true },
          },
          beneficiary: true,
        },
      }),

      this.prisma.logisticsRequest.count({ where }),
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
    const logistics = await this.prisma.logisticsRequest.findUnique({
      where: { id },
      include: {
        requestedBy: {
          select: { id: true, staffId: true, firstName: true, lastName: true },
        },
        sentTo: {
          select: { id: true, staffId: true, firstName: true, lastName: true },
        },
        beneficiary: true,
      },
    });

    if (!logistics) {
      throw new NotFoundException('Logistics request not found');
    }

    return { data: logistics };
  }

  async action(id: string, dto: LogisticsActionDto) {
    const logistics = await this.prisma.logisticsRequest.findUnique({
      where: { id },
    });

    if (!logistics) {
      throw new NotFoundException('Logistics request not found');
    }

    const updated = await this.prisma.logisticsRequest.update({
      where: { id },
      data: {
        status: dto.action === LogisticsAction.APPROVE ? 'APPROVED' : 'REJECTED',
        remarks: dto.remarks,
      },
      include: {
        requestedBy: {
          select: { id: true, staffId: true, firstName: true, lastName: true },
        },
        sentTo: {
          select: { id: true, staffId: true, firstName: true, lastName: true },
        },
        beneficiary: true,
      },
    });

    return {
      message: 'Logistics request updated successfully',
      data: updated,
    };
  }

  async remove(id: string) {
    const logistics = await this.prisma.logisticsRequest.findUnique({
      where: { id },
    });

    if (!logistics) {
      throw new NotFoundException('Logistics request not found');
    }

    await this.prisma.logisticsRequest.delete({ where: { id } });

    return { message: 'Logistics request deleted successfully' };
  }
}