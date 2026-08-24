import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { create } from 'domain';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentVoucherDto } from './dto/create-payment-voucher.dto';

@Injectable()
export class PaymentVoucherService {
    constructor(private readonly prisma: PrismaService) { }
        async create(
            dto: CreatePaymentVoucherDto,
            initialedById: string,
        ) {
            const procurement = await this.prisma.procurementRequest.findUnique({
                where: {
                    id: dto.procurementId,
                },
            });

            if(!procurement) {
                throw new Error('Procurement request not found');
            }

            if(procurement.status !== 'APPROVED') {
                throw new Error('Payment voucher can only be created for an approved procurement');
            }

            const existingVoucher = await this.prisma.paymentVoucher.findUnique({
                where: {
                    procurementId: dto.procurementId,
                },
            });

            if(existingVoucher) {
                throw new Error('Payment voucher already exists for this procurement');
            }

            const user = await this.prisma.user.findUnique({
                where: {
                    id: initialedById,
                },
            });

            if(!user) {
                throw new NotFoundException('User not found');
            }

            const vatPercentage = dto.vatPercentage ?? 7.5;
               
            const vatAmount = Number(procurement.totalPrice) * (vatPercentage / 100);

            const grossAmount = Number(procurement.totalPrice) + vatAmount;

            const voucher = await this.prisma.paymentVoucher.create({
                data: {
                    procurement: {
                        connect: {
                            id: dto.procurementId,
                        },
                    },

                    vatPercentage,
                    vatAmount,
                    grossAmount,

                    initiatedBy: {
    connect: {
      id: initialedById,
    },
  },

                    remarks: dto.remarks,

                    beneficiary: {
                        create: {
                            accountName: dto.beneficiary.accountName,
                            accountNumber: dto.beneficiary.accountNumber,
                            bankName: dto.beneficiary.bankName,
                        },
                    },
                },

                include: {
                    procurement: {
                        include: {
                            requestedBy: true,
                            sentTo: true,
                        },
                    },
                    
                    initiatedBy:  {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                    beneficiary: true,

                }
            });
  
            return {
                message: 'Payment voucher created successfully',
                data: voucher,
            };
        }

         async findAll() {
    return this.prisma.paymentVoucher.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      include: {
        procurement: {
          include: {
            requestedBy: true,
            sentTo: true,
          },
        },

        initiatedBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },

        verifiedBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },

        approvedBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },

        beneficiary: true,
      },
    });
  }

  // GET SINGLE
  async findOne(id: string) {
    const voucher =
      await this.prisma.paymentVoucher.findUnique({
        where: {
          id,
        },

        include: {
          procurement: {
            include: {
              requestedBy: true,
              sentTo: true,
            },
          },

          initiatedBy: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },

          verifiedBy: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },

          approvedBy: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },

          beneficiary: true,
        },
      });

    if (!voucher) {
      throw new NotFoundException(
        'Payment voucher not found',
      );
    }

    return voucher;
  }

  async verify(id: string, verifiedById: string) {
  const voucher = await this.prisma.paymentVoucher.findUnique({
    where: {
      id,
    },
  });

  if (!voucher) {
    throw new NotFoundException('Payment voucher not found');
  }

  if (voucher.status !== 'PENDING') {
    throw new BadRequestException(
      `Payment voucher cannot be verified because current status is ${voucher.status}`,
    );
  }

  const verifiedVoucher =
    await this.prisma.paymentVoucher.update({
      where: {
        id,
      },
      data: {
        status: 'VERIFIED',
        verifiedBy: {
          connect: {
            id: verifiedById,
          },
        },
      },
    });

  return {
    message: 'Payment voucher verified successfully',
    data: verifiedVoucher,
  };
}

async pay(id: string) {
  const voucher = await this.prisma.paymentVoucher.findUnique({
    where: {
      id,
    },
  });

  if (!voucher) {
    throw new NotFoundException('Payment voucher not found');
  }

  if (voucher.status !== 'APPROVED') {
    throw new BadRequestException(
      `Payment voucher cannot be paid because current status is ${voucher.status}`,
    );
  }

  const paidVoucher = await this.prisma.paymentVoucher.update({
    where: {
      id,
    },
    data: {
      status: 'PAID',
    },
  });

  return {
    message: 'Payment completed successfully',
    data: paidVoucher,
  };
}

async reject(id: string) {
  const voucher = await this.prisma.paymentVoucher.findUnique({
    where: {
      id,
    },
  });

  if (!voucher) {
    throw new NotFoundException('Payment voucher not found');
  }

  if (
    voucher.status !== 'PENDING' &&
    voucher.status !== 'VERIFIED'
  ) {
    throw new BadRequestException(
      `Payment voucher cannot be rejected because current status is ${voucher.status}`,
    );
  }

  const rejectedVoucher =
    await this.prisma.paymentVoucher.update({
      where: {
        id,
      },
      data: {
        status: 'REJECTED',
      },
    });

  return {
    message: 'Payment voucher rejected successfully',
    data: rejectedVoucher,
  };
}
            }
        
        

        
