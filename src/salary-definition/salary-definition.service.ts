import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSalaryDefinitionDto } from './dto/create-salary-definition.dto';

@Injectable()
export class SalaryDefinitionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSalaryDefinitionDto) {
    // Check staff
    const staff = await this.prisma.staff.findUnique({
      where: {
        id: dto.staffId,
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    // One salary definition per staff
    const existingSalary = await this.prisma.salaryDefinition.findUnique({
      where: {
        staffId: dto.staffId,
      },
    });

    if (existingSalary) {
      throw new BadRequestException(
        'Salary definition already exists for this staff',
      );
    }

    // Calculate gross salary
    const grossSalary =
      dto.basicSalary +
      dto.housingAllowance +
      dto.transportAllowance +
      dto.utilityAllowance +
      dto.productivityAllowance +
      dto.communicationAllowance +
      dto.inconvenienceAllowance;

    // Calculate net salary
    const netSalary = grossSalary - dto.deductions;

    if (netSalary < 0) {
      throw new BadRequestException(
        'Deductions cannot be greater than gross salary',
      );
    }

    const salaryDefinition =
      await this.prisma.salaryDefinition.create({
        data: {
          staff: {
            connect: {
              id: dto.staffId,
            },
          },

          basicSalary: dto.basicSalary,
          housingAllowance: dto.housingAllowance,
          transportAllowance: dto.transportAllowance,
          utilityAllowance: dto.utilityAllowance,
          productivityAllowance: dto.productivityAllowance,
          communicationAllowance: dto.communicationAllowance,
          inconvenienceAllowance: dto.inconvenienceAllowance,

          deductions: dto.deductions,

          grossSalary,
          netSalary,
        },

        include: {
          staff: {
            select: {
              id: true,
              staffId: true,
              firstName: true,
              lastName: true,
              designation: true,
              email: true,
            },
          },
        },
      });

    return {
      message: 'Salary definition created successfully',
      data: salaryDefinition,
    };
  }

async findAll(
  page = 1,
  limit = 10,
  search?: string,
) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          {
            staff: {
              firstName: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          },
          {
            staff: {
              lastName: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          },
          {
            staff: {
              staffId: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          },
          {
            staff: {
              designation: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          },
        ],
      }
    : {};

  const [data, total] = await Promise.all([
    this.prisma.salaryDefinition.findMany({
      where,
      skip,
      take: limit,

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        staff: {
          select: {
            id: true,
            staffId: true,
            firstName: true,
            lastName: true,
            designation: true,
            email: true,
          },
        },
      },
    }),

    this.prisma.salaryDefinition.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    message: 'Salary definitions retrieved successfully',

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