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
}