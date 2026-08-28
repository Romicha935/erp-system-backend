import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PayrollService {
  constructor(private readonly prisma: PrismaService) {}
    async create(dto: CreatePayrollDto) {
  if (!dto.items?.length) {
    throw new BadRequestException(
      'At least one staff is required',
    );
  }

  // Check duplicate payroll
  const existingPayroll = await this.prisma.payrollRun.findFirst({
    where: {
      month: dto.month,
      year: dto.year,
    },
  });

  if (existingPayroll) {
    throw new BadRequestException(
      'Payroll already exists for this month and year',
    );
  }

  // Get staff salary definitions
  const staffIds = dto.items.map((item) => item.staffId);

  const staffs = await this.prisma.staff.findMany({
    where: {
      id: {
        in: staffIds,
      },
    },
    include: {
      salaryDefinition: true,
    },
  });

  if (staffs.length !== staffIds.length) {
    throw new NotFoundException(
      'One or more staff members not found',
    );
  }

  // Check salary definitions
  const staffWithoutSalary = staffs.find(
    (staff) => !staff.salaryDefinition,
  );

  if (staffWithoutSalary) {
    throw new NotFoundException(
      `Salary definition not found for staff: ${staffWithoutSalary.firstName} ${staffWithoutSalary.lastName}`,
    );
  }

  return this.prisma.$transaction(async (tx) => {
    const payrollRun = await tx.payrollRun.create({
      data: {
        paymentName: dto.paymentName,
        designation: dto.designation,
        month: dto.month,
        year: dto.year,
        status: 'DRAFT',
      },
    });

const payrollItems: any[] = [];

    for (const staff of staffs) {
      const salary = staff.salaryDefinition!;

      const basicSalary = Number(salary.basicSalary);

      const housingAllowance = Number(
        salary.housingAllowance,
      );

      const transportAllowance = Number(
        salary.transportAllowance,
      );

      const utilityAllowance = Number(
        salary.utilityAllowance,
      );

      const productivityAllowance = Number(
        salary.productivityAllowance,
      );

      const communicationAllowance = Number(
        salary.communicationAllowance,
      );

      const inconvenienceAllowance = Number(
        salary.inconvenienceAllowance,
      );

      const grossSalary =
        basicSalary +
        housingAllowance +
        transportAllowance +
        utilityAllowance +
        productivityAllowance +
        communicationAllowance +
        inconvenienceAllowance;

      const tax = Number(salary.tax);
      const pension = Number(salary.pension);

      const deductions = tax + pension;

      const netSalary = grossSalary - deductions;

      const item = await tx.payrollItem.create({
        data: {
          payrollRunId: payrollRun.id,
          staffId: staff.id,

          basicSalary,
          housingAllowance,
          transportAllowance,
          utilityAllowance,
          productivityAllowance,
          communicationAllowance,
          inconvenienceAllowance,

          grossSalary,
          tax,
          pension,
          deductions,
          netSalary,
        },
      });

      payrollItems.push(item);
    }

    return {
      message: 'Payroll created successfully',
      data: {
        ...payrollRun,
        items: payrollItems,
      },
    };
  });
}

async findAll() {
    const payrolls = await this.prisma.payrollRun.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: {
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
        },
      },
    });

    return {
      message: 'Payrolls retrieved successfully',
      data: payrolls,
    };
  }

  // =========================
  // GET SINGLE PAYROLL
  // =========================
  async findOne(id: string) {
    const payroll = await this.prisma.payrollRun.findUnique({
      where: {
        id,
      },
      include: {
        items: {
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
        },
      },
    });

    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }

    return {
      message: 'Payroll retrieved successfully',
      data: payroll,
    };
  }

  // =========================
  // UPDATE PAYROLL
  // =========================
  async update(id: string, dto: any) {
    const existingPayroll = await this.prisma.payrollRun.findUnique({
      where: {
        id,
      },
    });

    if (!existingPayroll) {
      throw new NotFoundException('Payroll not found');
    }

    const payroll = await this.prisma.payrollRun.update({
      where: {
        id,
      },
      data: {
        ...(dto.paymentName !== undefined && {
          paymentName: dto.paymentName,
        }),

        ...(dto.designation !== undefined && {
          designation: dto.designation,
        }),

        ...(dto.month !== undefined && {
          month: Number(dto.month),
        }),

        ...(dto.year !== undefined && {
          year: Number(dto.year),
        }),

        ...(dto.status !== undefined && {
          status: dto.status,
        }),
      },
      include: {
        items: {
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
        },
      },
    });

    return {
      message: 'Payroll updated successfully',
      data: payroll,
    };
  }

  // =========================
  // DELETE PAYROLL
  // =========================
  async remove(id: string) {
    const existingPayroll = await this.prisma.payrollRun.findUnique({
      where: {
        id,
      },
    });

    if (!existingPayroll) {
      throw new NotFoundException('Payroll not found');
    }

    await this.prisma.payrollRun.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Payroll deleted successfully',
    };
  }
}
