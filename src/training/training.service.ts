import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingStatusDto } from './dto/update-training-status.dto';
import { TrainingQueryDto } from './dto/trainng-query.dto';

@Injectable()
export class TrainingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(userId: string, dto: CreateTrainingDto) {
    const training = await this.prisma.trainingRequest.create({
      data: {
        description: dto.description,
        type: dto.type,
        durationValue: dto.durationValue,
        durationUnit: dto.durationUnit,
        startDate: new Date(dto.startDate),
        mode: dto.mode,
        createdById: userId,
        participants: {
          create: dto.participantIds.map((staffId) => ({ staffId })),
        },
      },
      include: {
        participants: {
          include: {
            staff: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    // Create notification for each participant
    for (const participant of training.participants) {
      if (participant.staff.user) {
        await this.notificationService.create({
          userId: participant.staff.user.id,
          message: `You have been enrolled in training: "${training.description}"`,
        });
      }
    }

    return {
      message: 'Training request created successfully',
      data: training,
    };
  }

  async findAll(query: TrainingQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.description = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.trainingRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          participants: {
            include: {
              staff: true,
            },
          },
        },
      }),

      this.prisma.trainingRequest.count({ where }),
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

  async getSummary() {
    const all = await this.prisma.trainingRequest.findMany({
      include: {
        participants: true,
      },
    });

    const totalRequests = all.length;

    const totalStaffTrained = new Set(
      all
        .filter((t) => t.status === 'COMPLETED')
        .flatMap((t) =>
          t.participants.map((p) => p.staffId),
        ),
    ).size;

    const totalCompleted = all.filter(
      (t) => t.status === 'COMPLETED',
    ).length;

    const trainingRate =
      totalRequests > 0
        ? Math.round((totalCompleted / totalRequests) * 100)
        : 0;

    return {
      data: {
        totalRequests,
        totalStaffTrained,
        totalCompleted,
        trainingRate,
      },
    };
  }

  async findOne(id: string) {
    const training = await this.prisma.trainingRequest.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            staff: true,
          },
        },
      },
    });

    if (!training) {
      throw new NotFoundException('Training request not found');
    }

    return {
      data: training,
    };
  }

  async updateStatus(
    id: string,
    dto: UpdateTrainingStatusDto,
  ) {
    const training =
      await this.prisma.trainingRequest.findUnique({
        where: { id },
      });

    if (!training) {
      throw new NotFoundException('Training request not found');
    }

    const updated =
      await this.prisma.trainingRequest.update({
        where: { id },
        data: {
          status: dto.status,
        },
        include: {
          participants: {
            include: {
              staff: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

    // Notify participants about status update
    for (const participant of updated.participants) {
      if (participant.staff.user) {
        await this.notificationService.create({
          userId: participant.staff.user.id,
          message: `Training "${updated.description}" status updated to ${dto.status}.`,
        });
      }
    }

    return {
      message: 'Training status updated successfully',
      data: updated,
    };
  }

  async remove(id: string) {
    const training =
      await this.prisma.trainingRequest.findUnique({
        where: { id },
      });

    if (!training) {
      throw new NotFoundException('Training request not found');
    }

    await this.prisma.trainingRequest.delete({
      where: { id },
    });

    return {
      message: 'Training request deleted successfully',
    };
  }
}