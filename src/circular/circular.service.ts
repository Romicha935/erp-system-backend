// circular.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCircularDto } from './dto/create-circular.dto';
import { CircularQueryDto, CircularType } from './dto/circular-query.dt';


@Injectable()
export class CircularService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCircularDto) {
    const circular = await this.prisma.circular.create({
      data: {
        title: dto.title,
        message: dto.message,
        sentToGroup: dto.sentToGroup,
        senderId: userId,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return {
      message: 'Circular created successfully',
      data: circular,
    };
  }

  async findAll(currentUserId: string, query: CircularQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.type === CircularType.SENT) {
      where.senderId = currentUserId;
    }

    if (query.type === CircularType.RECEIVED) {
      const currentUser = await this.prisma.user.findUnique({
        where: { id: currentUserId },
        include: { staff: true },
      });

      const userGroups = ['All Staff'];
      if (currentUser?.staff?.designation) {
        userGroups.push(`${currentUser.staff.designation} Staffs`);
      }

      where.sentToGroup = { in: userGroups };
      where.senderId = { not: currentUserId };
    }

    if (query.search) {
      where.AND = [
        ...(where.AND ?? []),
        {
          OR: [
            { title: { contains: query.search, mode: 'insensitive' } },
            { message: { contains: query.search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.circular.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      }),

      this.prisma.circular.count({ where }),
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
    const circular = await this.prisma.circular.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!circular) {
      throw new NotFoundException('Circular not found');
    }

    return { data: circular };
  }

  async remove(currentUserId: string, id: string) {
    const circular = await this.prisma.circular.findUnique({
      where: { id },
    });

    if (!circular) {
      throw new NotFoundException('Circular not found');
    }

    if (circular.senderId !== currentUserId) {
      throw new BadRequestException('Only the sender can delete this circular');
    }

    await this.prisma.circular.delete({
      where: { id },
    });

    return { message: 'Circular deleted successfully' };
  }
}