import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePayslipDto } from './dto/create-payslip.dto';
import { UpdatePayslipDto } from './dto/update-payslip.dto';

@Injectable()
export class PayslipService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePayslipDto) {
    const salary = await this.prisma.salaryDefinition.findUnique({
      where: {
        staffId: dto.staffId,
      },
    });

    if (!salary) {
      throw new NotFoundException(
        'Salary definition not found for this staff',
      );
    }

    const existingPayslip = await this.prisma.payslip.findUnique({
      where: {
        staffId_month_year: {
          staffId: dto.staffId,
          month: dto.month,
          year: dto.year,
        },
      },
    });

    if (existingPayslip) {
      throw new BadRequestException(
        'Payslip already exists for this month',
      );
    }

    const basicSalary = Number(salary.basicSalary);
    const housingAllowance = Number(salary.housingAllowance);
    const transportAllowance = Number(salary.transportAllowance);
    const utilityAllowance = Number(salary.utilityAllowance);
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

    const tax =
      dto.tax !== undefined
        ? Number(dto.tax)
        : Number(salary.tax);

    const pension =
      dto.pension !== undefined
        ? Number(dto.pension)
        : Number(salary.pension);

    const totalDeduction = tax + pension;

    const netSalary = grossSalary - totalDeduction;

    return this.prisma.payslip.create({
      data: {
        staffId: dto.staffId,
        month: dto.month,
        year: dto.year,

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
        totalDeduction,

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
          },
        },
      },
    });
  }

  async findAll(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [payslips, total] = await Promise.all([
    this.prisma.payslip.findMany({
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

    this.prisma.payslip.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    message: 'Payslips retrieved successfully',
    data: payslips,
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

async findOne(id: string) {
  const payslip = await this.prisma.payslip.findUnique({
    where: {
      id,
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

  if (!payslip) {
    throw new NotFoundException('Payslip not found');
  }

  return {
    message: 'Payslip retrieved successfully',
    data: payslip,
  };
}

async update(id: string, dto: UpdatePayslipDto) {
  const existingPayslip = await this.prisma.payslip.findUnique({
    where: {
      id,
    },
  });

  if (!existingPayslip) {
    throw new NotFoundException('Payslip not found');
  }

  const staffId = dto.staffId ?? existingPayslip.staffId;

  const salary = await this.prisma.salaryDefinition.findUnique({
    where: {
      staffId,
    },
  });

  if (!salary) {
    throw new NotFoundException(
      'Salary definition not found for this staff',
    );
  }

  const basicSalary = Number(salary.basicSalary);
  const housingAllowance = Number(salary.housingAllowance);
  const transportAllowance = Number(salary.transportAllowance);
  const utilityAllowance = Number(salary.utilityAllowance);
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

  const tax =
    dto.tax !== undefined
      ? Number(dto.tax)
      : Number(existingPayslip.tax);

  const pension =
    dto.pension !== undefined
      ? Number(dto.pension)
      : Number(existingPayslip.pension);

  const totalDeduction = tax + pension;
  const netSalary = grossSalary - totalDeduction;

  return this.prisma.payslip.update({
    where: {
      id,
    },

    data: {
      staffId,

      ...(dto.month !== undefined && {
        month: dto.month,
      }),

      ...(dto.year !== undefined && {
        year: dto.year,
      }),

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
      totalDeduction,

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
        },
      },
    },
  });
}

async remove(id: string) {
  const payslip = await this.prisma.payslip.findUnique({
    where: {
      id,
    },
  });

  if (!payslip) {
    throw new NotFoundException('Payslip not found');
  }

  await this.prisma.payslip.delete({
    where: {
      id,
    },
  });

  return {
    message: 'Payslip deleted successfully',
  };
}
}