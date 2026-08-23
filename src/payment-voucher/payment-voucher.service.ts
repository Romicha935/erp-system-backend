import { Injectable, NotFoundException } from '@nestjs/common';
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
            }
        
        

        
