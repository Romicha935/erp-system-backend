import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  
  async createNotification(
    userId: string,
    message: string,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        message,
      },
    });
  }

  // Optional: manual create
  async create(dto: CreateNotificationDto) {
    const notification = await this.createNotification(
      dto.userId,
      dto.message,
    );

    return {
      message: 'Notification created successfully',
      data: notification,
    };
  }

  async findAll(
    currentUserId: string,
    query: NotificationQueryDto,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {
      userId: currentUserId,
    };

    if (query.filter === 'unread') {
      where.isRead = false;
    }

    const [notifications, total, unreadCount] =
      await Promise.all([
        this.prisma.notification.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),

        this.prisma.notification.count({
          where,
        }),

        this.prisma.notification.count({
          where: {
            userId: currentUserId,
            isRead: false,
          },
        }),
      ]);

    const grouped = this.groupByDate(notifications);

    return {
      data: grouped,
      unreadCount,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private groupByDate(notifications: any[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups: Record<string, any[]> = {};

    for (const notif of notifications) {
      const notifDate = new Date(notif.createdAt);
      notifDate.setHours(0, 0, 0, 0);

      let groupKey: string;

      if (notifDate.getTime() === today.getTime()) {
        groupKey = 'Today';
      } else if (
        notifDate.getTime() === yesterday.getTime()
      ) {
        groupKey = 'Yesterday';
      } else {
        groupKey = notifDate.toLocaleDateString(
          'en-GB',
          {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          },
        );
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }

      groups[groupKey].push(notif);
    }

    return Object.entries(groups).map(
      ([group, items]) => ({
        group,
        items,
      }),
    );
  }

  async markAsRead(
    currentUserId: string,
    id: string,
  ) {
    const notification =
      await this.prisma.notification.findUnique({
        where: { id },
      });

    if (
      !notification ||
      notification.userId !== currentUserId
    ) {
      throw new NotFoundException(
        'Notification not found',
      );
    }

    const updated =
      await this.prisma.notification.update({
        where: { id },
        data: {
          isRead: true,
        },
      });

    return {
      message: 'Notification marked as read',
      data: updated,
    };
  }

  async markAllAsRead(
    currentUserId: string,
  ) {
    await this.prisma.notification.updateMany({
      where: {
        userId: currentUserId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return {
      message: 'All notifications marked as read',
    };
  }

  async remove(
    currentUserId: string,
    id: string,
  ) {
    const notification =
      await this.prisma.notification.findUnique({
        where: { id },
      });

    if (
      !notification ||
      notification.userId !== currentUserId
    ) {
      throw new NotFoundException(
        'Notification not found',
      );
    }

    await this.prisma.notification.delete({
      where: { id },
    });

    return {
      message: 'Notification deleted successfully',
    };
  }

  async removeAll(
    currentUserId: string,
  ) {
    await this.prisma.notification.deleteMany({
      where: {
        userId: currentUserId,
      },
    });

    return {
      message: 'All notifications deleted successfully',
    };
  }
}