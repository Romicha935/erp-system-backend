import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProcurementDto } from './dto/create-procurement.dto';

@Injectable()
export class ProcurementService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    dto: CreateProcurementDto,
    currentUserId: string,
  ) {
    const totalPrice =
      Number(dto.quantity) * Number(dto.unitPrice);

    const sn = await this.generateSN();

    const procurement =
      await this.prisma.procurementRequest.create({
        data: {
          sn,

          item: dto.item,

          quantity: dto.quantity,


          unitPrice: dto.unitPrice,

          totalPrice,

          requestedById: currentUserId,

          sentToId: dto.sentToId,

          hasAttachment: dto.hasAttachment,

          attachmentType:
            dto.attachmentType as any,

          attachmentUrl:
            dto.attachmentUrl,
        },
      });

    return procurement;
  }

  private async generateSN() {
    const last =
      await this.prisma.procurementRequest.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
      });

    if (!last) {
      return '01';
    }

    const next = Number(last.sn) + 1;

    return String(next).padStart(2, '0');
  }
}