import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateMemoDto } from './dto/create-memo.dto';
import { MemoAction, MemoActionDto } from './dto/memo-action.dto';
import { MemoQueryDto, MemoType } from './dto/memo-query.dto';

@Injectable()
export class MemoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateMemoDto) {
    console.log('=== MEMO CREATE DEBUG ===');
    console.log('userId:', userId);
    console.log('Full DTO:', JSON.stringify(dto));
    console.log('receiverId value:', dto.receiverId);
    console.log('receiverId type:', typeof dto.receiverId);
    console.log('receiverId length:', dto.receiverId?.length);

    const receiver = await this.prisma.staff.findUnique({
      where: {
        id: dto.receiverId,
      },
    });

    console.log('Receiver query result:', receiver);
    console.log('=========================');

    console.log('=== DATABASE DEBUG ===');

console.log(
  await this.prisma.$queryRaw`
    SELECT current_database(), current_user
  `,
);

const allStaff = await this.prisma.staff.findMany({
  select: {
    id: true,
    staffId: true,
    firstName: true,
    lastName: true,
  },
});

console.log('ALL STAFF FROM PRISMA:', allStaff);

console.log('======================');

    if (!receiver) {
      throw new NotFoundException('Receiver staff not found');
    }

    const memo = await this.prisma.memo.create({
      data: {
        title: dto.title,
        message: dto.message,
        senderId: userId,
        receiverId: receiver.id,
        hasAttachment: dto.hasAttachment ?? false,
        attachmentType: dto.attachmentType ?? null,
        attachmentUrl: dto.attachmentUrl ?? null,
        action: dto.action ?? null,
        remarks: dto.remarks ?? null,
      },

      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },

        receiver: {
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
    });

    return {
      message: 'Memo created successfully',
      data: memo,
    };
  }

  async findAll(currentUserId: string, query: MemoQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.type === MemoType.SENT) {
      where.senderId = currentUserId;
    }

    if (query.type === MemoType.RECEIVED) {
      where.receiverId = currentUserId;
    }

    if (query.search) {
      where.OR = [
        {
          title: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          message: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.memo.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          sender: {
            select: {
              id: true,
              email: true,
              role: true,
              staff: {
                select: {
                  id: true,
                  staffId: true,
                  firstName: true,
                  lastName: true,
                  officialEmail: true,
                },
              },
            },
          },
          receiver: {
            select: {
              id: true,
              staffId: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      }),

      this.prisma.memo.count({
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

  async findOne(currentUserId: string, id: string) {
    const memo = await this.prisma.memo.findUnique({
      where: {
        id,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    if (!memo) {
      throw new NotFoundException('Memo not found');
    }

    if (memo.senderId !== currentUserId && memo.receiverId !== currentUserId) {
      throw new NotFoundException('Memo not found');
    }

    return memo;
  }

  async action(currentUserId: string, id: string, dto: MemoActionDto) {
    const memo = await this.prisma.memo.findUnique({
      where: {
        id,
      },
    });

    if (!memo) {
      throw new NotFoundException('Memo not found');
    }

    if (memo.receiverId !== currentUserId) {
      throw new BadRequestException(
        'Only the receiver can take action on this memo',
      );
    }

    return this.prisma.memo.update({
      where: {
        id,
      },
      data: {
        status: dto.action === MemoAction.APPROVE ? 'APPROVED' : 'REJECTED',
        action: dto.action,
        remarks: dto.remarks,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
  }

  async remove(currentUserId: string, id: string) {
    const memo = await this.prisma.memo.findUnique({
      where: {
        id,
      },
    });

    if (!memo) {
      throw new NotFoundException('Memo not found');
    }

    if (memo.senderId !== currentUserId) {
      throw new BadRequestException('Only the sender can delete this memo');
    }

    return this.prisma.memo.delete({
      where: {
        id,
      },
    });
  }
}