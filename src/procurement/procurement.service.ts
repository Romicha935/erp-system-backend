import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateProcurementDto } from './dto/create-procurement.dto';

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
  async findAll() {
    const procurements =
      await this.prisma.procurementRequest.findMany({
        orderBy: {
          createdAt: 'desc',
        },

        include: {
          requestedBy: true,
          sentTo: true,
          paymentVoucher: true,
        },
      });

    return {
      data: procurements,
      meta: {
        total: procurements.length,
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
}
