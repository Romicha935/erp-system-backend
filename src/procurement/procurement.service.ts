import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateProcurementDto } from './dto/create-procurement.dto';
import { ProcurementQueryDto } from './dto/procurement-query.dto';


import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class ProcurementService {
  constructor(private readonly prisma: PrismaService) {}

  // =====================================================
  // CREATE PROCUREMENT
  // =====================================================

  async create(
    dto: CreateProcurementDto,
    currentUserId: string,
  ) {
    const totalPrice = dto.quantity * dto.unitPrice;

    const vatPercentage = 7.5;

    const vatAmount =
      totalPrice * (vatPercentage / 100);

    const grossAmount =
      totalPrice + vatAmount;

    const sn = await this.generateSN();

    const procurement =
      await this.prisma.$transaction(async (tx) => {
        const request =
          await tx.procurementRequest.create({
            data: {
              sn,

              item: dto.item,
              quantity: dto.quantity,
              unitPrice: new Prisma.Decimal(
                dto.unitPrice,
              ),
              totalPrice: new Prisma.Decimal(
                totalPrice,
              ),

              requestedById: currentUserId,
              sentToId: dto.sentToId,

              hasAttachment:
                dto.hasAttachment ?? false,

              attachmentType:
                dto.attachmentType,

              attachmentUrl:
                dto.attachmentUrl,

              paymentVoucher: dto.voucher
                ? {
                    create: {
                      vatPercentage:
                        new Prisma.Decimal(
                          vatPercentage,
                        ),

                      vatAmount:
                        new Prisma.Decimal(
                          vatAmount,
                        ),

                      grossAmount:
                        new Prisma.Decimal(
                          grossAmount,
                        ),

                      initiatedById:
                        currentUserId,

                      verifiedById:
                        dto.voucher
                          .verifiedById,

                      approvedById:
                        dto.voucher
                          .approvedById,

                      beneficiary: {
                        create: {
                          accountName:
                            dto.voucher
                              .accountName,

                          accountNumber:
                            dto.voucher
                              .accountNumber,

                          bankName:
                            dto.voucher
                              .bankName,
                        },
                      },
                    },
                  }
                : undefined,
            },

            include: {
              requestedBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },

              sentTo: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },

              paymentVoucher: {
                include: {
                  beneficiary: true,
                },
              },
            },
          });

        return request;
      });

    return {
      message: 'Procurement request created successfully',
      data: procurement,
    };
  }

  // =====================================================
  // GET ALL PROCUREMENT
  // =====================================================

  async findAll(query: ProcurementQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const skip = (page - 1) * limit;

    const [data, total] =
      await Promise.all([
        this.prisma.procurementRequest.findMany({
          skip,
          take: limit,

          orderBy: {
            createdAt: 'desc',
          },

          include: {
            requestedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },

            sentTo: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        }),

        this.prisma.procurementRequest.count(),
      ]);

    return {
      data,

      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit,
        ),
      },
    };
  }

  // =====================================================
  // GET SINGLE PROCUREMENT
  // =====================================================

  async findOne(id: string) {
    const procurement =
      await this.prisma.procurementRequest.findUnique({
        where: {
          id,
        },

        include: {
          requestedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },

          sentTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },

          paymentVoucher: {
            include: {
              beneficiary: true,

              initiatedBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },

              verifiedBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },

              approvedBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

    if (!procurement) {
      throw new NotFoundException(
        'Procurement request not found',
      );
    }

    return procurement;
  }

  // =====================================================
  // APPROVE / REJECT
  // =====================================================

  async action(
    id: string,
    dto: ProcurementActionDto,
    currentUserId: string,
  ) {
    const procurement =
      await this.prisma.procurementRequest.findUnique({
        where: { id },
      });

    if (!procurement) {
      throw new NotFoundException(
        'Procurement request not found',
      );
    }

    const status =
      dto.action === 'APPROVE'
        ? RequestStatus.APPROVED
        : RequestStatus.REJECTED;

    const updated =
      await this.prisma.procurementRequest.update({
        where: {
          id,
        },

        data: {
          status,

          paymentVoucher: {
            update: {
              approvedById:
                dto.action === 'APPROVE'
                  ? currentUserId
                  : undefined,

              remarks: dto.remarks,
            },
          },
        },

        include: {
          paymentVoucher: true,
        },
      });

    return {
      message:
        dto.action === 'APPROVE'
          ? 'Procurement request approved successfully'
          : 'Procurement request rejected successfully',

      data: updated,
    };
  }

  // =====================================================
  // METRICS
  // =====================================================

  async getMetrics() {
    const [
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      totalCost,
    ] = await Promise.all([
      this.prisma.procurementRequest.count(),

      this.prisma.procurementRequest.count({
        where: {
          status: RequestStatus.PENDING,
        },
      }),

      this.prisma.procurementRequest.count({
        where: {
          status: RequestStatus.APPROVED,
        },
      }),

      this.prisma.procurementRequest.count({
        where: {
          status: RequestStatus.REJECTED,
        },
      }),

      this.prisma.procurementRequest.aggregate({
        _sum: {
          totalPrice: true,
        },
      }),
    ]);

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      totalCost: totalCost._sum.totalPrice ?? 0,
    };
  }

  // =====================================================
  // GENERATE S/N
  // =====================================================

  private async generateSN() {
    const count =
      await this.prisma.procurementRequest.count();

    return String(count + 1).padStart(2, '0');
  }
}