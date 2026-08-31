
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { InventoryQueryDto } from './dto/inventory-query.dto';
import { CreateInventoryItemDto } from './dto/create-inventory.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  private withComputed(item: any) {
    const totalAmount = Number(item.qtyPurchased) * Number(item.unitPrice);

    let status = '';
    let statusType: 'success' | 'warning' | 'danger' = 'success';

    if (item.type === 'STOCK') {
      const stock = item.quantityInStock ?? 0;
      if (stock === 0) {
        status = 'Out of Stock';
        statusType = 'danger';
      } else if (stock <= item.qtyPurchased * 0.25) {
        status = 'Low in Stock';
        statusType = 'warning';
      } else {
        status = 'In Stock';
        statusType = 'success';
      }
    } else {
      const total = item.totalUnits ?? item.qtyPurchased;
      const functioning = item.functioningUnits ?? total;

      if (functioning === total) {
        status = 'All functioning';
        statusType = 'success';
      } else if (functioning === 0) {
        status = 'None functioning';
        statusType = 'danger';
      } else {
        status = `${functioning} functioning`;
        statusType = 'warning';
      }
    }

    return { ...item, totalAmount, status, statusType };
  }

  async create(userId: string, dto: CreateInventoryItemDto) {
    const item = await this.prisma.inventoryItem.create({
      data: {
        type: dto.type,
        productName: dto.productName,
        productId: dto.productId,
        category: dto.category,
        qtyPurchased: dto.qtyPurchased,
        unitPrice: dto.unitPrice,
        supplier: dto.supplier,
        imageUrl: dto.imageUrl ?? null,
        quantityInStock: dto.quantityInStock ?? null,
        totalUnits: dto.totalUnits ?? null,
        functioningUnits: dto.functioningUnits ?? null,
        createdById: userId,
      },
    });

    return {
      message: 'Item added successfully',
      data: this.withComputed(item),
    };
  }

  async findAll(query: InventoryQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.type) {
      where.type = query.type;
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.search) {
      where.OR = [
        { productName: { contains: query.search, mode: 'insensitive' } },
        { productId: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.inventoryItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),

      this.prisma.inventoryItem.count({ where }),
    ]);

    return {
      data: data.map((item) => this.withComputed(item)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const item = await this.prisma.inventoryItem.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return { data: this.withComputed(item) };
  }

  async update(id: string, dto: UpdateInventoryItemDto) {
    const item = await this.prisma.inventoryItem.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    const updated = await this.prisma.inventoryItem.update({
      where: { id },
      data: {
        productName: dto.productName,
        productId: dto.productId,
        category: dto.category,
        qtyPurchased: dto.qtyPurchased,
        unitPrice: dto.unitPrice,
        supplier: dto.supplier,
        imageUrl: dto.imageUrl,
        quantityInStock: dto.quantityInStock,
        totalUnits: dto.totalUnits,
        functioningUnits: dto.functioningUnits,
      },
    });

    return {
      message: 'Item updated successfully',
      data: this.withComputed(updated),
    };
  }

  async remove(id: string) {
    const item = await this.prisma.inventoryItem.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    await this.prisma.inventoryItem.delete({ where: { id } });

    return { message: 'Item deleted successfully' };
  }

  async getSummary(type: 'STOCK' | 'INVENTORY') {
    const items = await this.prisma.inventoryItem.findMany({ where: { type } });

    const categories = new Set(items.map((i) => i.category)).size;
    const totalItems = items.reduce((sum, i) => sum + i.qtyPurchased, 0);
    const totalCost = items.reduce(
      (sum, i) => sum + Number(i.qtyPurchased) * Number(i.unitPrice),
      0,
    );

    if (type === 'STOCK') {
      const lowInStock = items.filter((i) => {
        const stock = i.quantityInStock ?? 0;
        return stock <= i.qtyPurchased * 0.25;
      }).length;

      return {
        data: { categories, totalItems, totalCost, lowInStock },
      };
    } else {
      const suppliers = new Set(items.map((i) => i.supplier)).size;

      return {
        data: { categories, totalItems, totalCost, suppliers },
      };
    }
  }
}