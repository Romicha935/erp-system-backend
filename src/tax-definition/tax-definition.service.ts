import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaxDefinitionDto } from './dto/create-tax-definition.dto';
;

@Injectable()
export class TaxDefinitionService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateTaxDefinitionDto) {
    const existingTax =
      await this.prisma.taxDefinition.findFirst({
        where: {
          taxType: dto.taxType,
        },
      });

    if (existingTax) {
      throw new BadRequestException(
        'Tax definition already exists',
      );
    }

    const taxDefinition =
      await this.prisma.taxDefinition.create({
        data: {
          taxType: dto.taxType,
          percentage: dto.percentage,
        },
      });

    return {
      message: 'Tax definition created successfully',
      data: taxDefinition,
    };
  }

  async findAll(page = 1, limit = 10, search?: string) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        taxType: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }
    : {};

  const [data, total] = await Promise.all([
    this.prisma.taxDefinition.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),

    this.prisma.taxDefinition.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    message: 'Tax definitions retrieved successfully',
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
}