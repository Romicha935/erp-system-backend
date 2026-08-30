// budget.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { BudgetQueryDto } from './dto/budget-query.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';


@Injectable()
export class BudgetService {
  constructor(private readonly prisma: PrismaService) {}

  private withVariance(budget: any) {
    const budgeted = Number(budget.budgetedAmount);
    const actual = budget.actualAmount !== null ? Number(budget.actualAmount) : null;
    const variance = actual !== null ? budgeted - actual : null;

    return {
      ...budget,
      variance,
      isPositiveVariance: variance !== null ? variance >= 0 : null,
    };
  }

  async create(userId: string, dto: CreateBudgetDto) {
    const budget = await this.prisma.budget.create({
      data: {
        budgetNo: dto.budgetNo,
        description: dto.description,
        budgetedAmount: dto.budgetedAmount,
        receivingOffice: dto.receivingOffice ?? null,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: { id: true, email: true, role: true },
        },
      },
    });

    return {
      message: 'Budget created successfully',
      data: this.withVariance(budget),
    };
  }

  async findAll(query: BudgetQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { budgetNo: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.budget.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: { id: true, email: true, role: true },
          },
        },
      }),

      this.prisma.budget.count({ where }),
    ]);

    return {
      data: data.map((b) => this.withVariance(b)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const budget = await this.prisma.budget.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, email: true, role: true },
        },
      },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return { data: this.withVariance(budget) };
  }

  async update(id: string, dto: UpdateBudgetDto) {
    const budget = await this.prisma.budget.findUnique({ where: { id } });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    const updated = await this.prisma.budget.update({
      where: { id },
      data: {
        actualAmount: dto.actualAmount,
        status: dto.status,
      },
      include: {
        createdBy: {
          select: { id: true, email: true, role: true },
        },
      },
    });

    return {
      message: 'Budget updated successfully',
      data: this.withVariance(updated),
    };
  }

  async remove(id: string) {
    const budget = await this.prisma.budget.findUnique({ where: { id } });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    await this.prisma.budget.delete({ where: { id } });

    return { message: 'Budget deleted successfully' };
  }

  async getSummary() {
    const budgets = await this.prisma.budget.findMany();

    const totalAnnualBudget = budgets.reduce((sum, b) => sum + Number(b.budgetedAmount), 0);
    const amountUsedYTD = budgets.reduce((sum, b) => sum + Number(b.actualAmount ?? 0), 0);
    const totalBalance = totalAnnualBudget - amountUsedYTD;
    const percentUsed = totalAnnualBudget > 0 ? (amountUsedYTD / totalAnnualBudget) * 100 : 0;

    return {
      data: {
        totalAnnualBudget,
        amountUsedYTD,
        totalBalance,
        percentUsed: Math.round(percentUsed * 100) / 100,
      },
    };
  }
}