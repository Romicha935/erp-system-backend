import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateProcurementDto } from './dto/create-procurement.dto';
import { ProcurementQueryDto } from './dto/procurement-query.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ProcurementService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // Generate S/N
  private async generateSN(): Promise<string> {
    const lastProcurement =
      await this.prisma.procurementRequest.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          sn: true,
        },
      });

    if (!lastProcurement) {
      return '01';
    }

    const lastNumber = parseInt(
      lastProcurement.sn,
      10,
    );

    return String(lastNumber + 1).padStart(2, '0');
  }

  // CREATE
  async create(dto: CreateProcurementDto) {
    const requestedBy =
      await this.prisma.staff.findUnique({
        where: {
          id: dto.requestedById,
        },
      });

    if (!requestedBy) {
      throw new NotFoundException(
        'Requesting staff not found',
      );
    }

    const sentTo =
      await this.prisma.staff.findUnique({
        where: {
          id: dto.sentToId,
        },
      });

    if (!sentTo) {
      throw new NotFoundException(
        'Selected staff not found',
      );
    }

    const sn = await this.generateSN();

    const procurement =
      await this.prisma.procurementRequest.create({
        data: {
          sn,
          item: dto.item,
          quantity: dto.quantity,
          unitPrice: dto.unitPrice,
          totalPrice: dto.totalPrice,

          requestedBy: {
            connect: {
              id: dto.requestedById,
            },
          },

          sentTo: {
            connect: {
              id: dto.sentToId,
            },
          },

          hasAttachment:
            dto.hasAttachment ?? false,

          attachmentType:
            dto.attachmentType,

          attachmentUrl:
            dto.attachmentUrl,
        },
      });

    return {
      message:
        'Procurement request created successfully',
      data: procurement,
    };
  }

  // GET ALL
 async findAll(query: ProcurementQueryDto) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);

  const skip = (page - 1) * limit;

  const where: Prisma.ProcurementRequestWhereInput = {};

  // Status filter
  if (query.status) {
    where.status = query.status;
  }

  // Search
  if (query.search) {
    where.OR = [
      {
        item: {
          contains: query.search,
          mode: 'insensitive',
        },
      },
      {
        sn: {
          contains: query.search,
          mode: 'insensitive',
        },
      },
      {
        requestedBy: {
          OR: [
            {
              firstName: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
            {
              lastName: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
            {
              staffId: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          ],
        },
      },
      {
        sentTo: {
          OR: [
            {
              firstName: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
            {
              lastName: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
            {
              staffId: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          ],
        },
      },
    ];
  }

  const [data, total] = await Promise.all([
    this.prisma.procurementRequest.findMany({
      where,
      skip,
      take: limit,

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        requestedBy: {
          select: {
            id: true,
            staffId: true,
            firstName: true,
            lastName: true,
            officialEmail: true,
            role: true,
          },
        },

        sentTo: {
          select: {
            id: true,
            staffId: true,
            firstName: true,
            lastName: true,
            officialEmail: true,
            role: true,
          },
        },
      },
    }),

    this.prisma.procurementRequest.count({
      where,
    }),
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

  // GET SINGLE
  async findOne(id: string) {
    const procurement =
      await this.prisma.procurementRequest.findUnique({
        where: {
          id,
        },

        include: {
          requestedBy: true,
          sentTo: true,
          paymentVoucher: true,
        },
      });

    if (!procurement) {
      throw new NotFoundException(
        'Procurement request not found',
      );
    }

    return {
      data: procurement,
    };
  }

  async approve(id: string, approvedById: string) {
  const procurement =
    await this.prisma.procurementRequest.findUnique({
      where: {
        id,
      },
    });

  if (!procurement) {
    throw new NotFoundException(
      'Procurement request not found',
    );
  }

  if (procurement.status === 'APPROVED') {
    throw new BadRequestException(
      'Procurement request is already approved',
    );
  }

  const updated =
    await this.prisma.procurementRequest.update({
      where: {
        id,
      },
      data: {
        status: 'APPROVED',
      },
    });

  return {
    message: 'Procurement request approved successfully',
    data: updated,
  };
}

  // REMOVE
  async remove(id: string) {
    const procurement =
      await this.prisma.procurementRequest.delete({
        where: {
          id,
        },
      });

    return {
      message:
        'Procurement request deleted successfully',
    };
  }

  async reject(id: string) {
  const procurement = await this.prisma.procurementRequest.findUnique({
    where: {
      id,
    },
  });

  if (!procurement) {
    throw new NotFoundException('Procurement request not found');
  }

  if (procurement.status !== 'PENDING') {
    throw new BadRequestException(
      `Procurement request cannot be rejected because current status is ${procurement.status}`,
    );
  }

  const rejectedProcurement =
    await this.prisma.procurementRequest.update({
      where: {
        id,
      },
      data: {
        status: 'REJECTED',
      },
    });

  return {
    message: 'Procurement request rejected successfully',
    data: rejectedProcurement,
  };
}
}
