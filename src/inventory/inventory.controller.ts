import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { InventoryService } from './inventory.service';
import { InventoryQueryDto } from './dto/inventory-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UpdateInventoryItemDto } from './dto/update-inventory.dto';
import { CreateInventoryItemDto } from './dto/create-inventory.dto';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
  ) {}
@Post()
@UseInterceptors(
  FileInterceptor('image', {
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new BadRequestException('Only JPG, JPEG and PNG images are allowed'), false);
      }
      cb(null, true);
    },
  }),
)
create(
  @Req() req,
  @Body() dto: CreateInventoryItemDto,   
  @UploadedFile() image?: Express.Multer.File,
) {
  return this.inventoryService.create(req.user.id, dto, image); 
}

  @Get()
  findAll(@Query() query: InventoryQueryDto) {
    return this.inventoryService.findAll(query);
  }

  @Get('summary')
  getSummary(
    @Query('type') type: 'STOCK' | 'INVENTORY',
  ) {
    return this.inventoryService.getSummary(
      type ?? 'STOCK',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateInventoryItemDto,
  ) {
    return this.inventoryService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}


// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
//   Query,
//   Req,
//   UseGuards,
// } from '@nestjs/common';

// import { InventoryService } from './inventory.service';

// import { InventoryQueryDto } from './dto/inventory-query.dto';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
// import { UpdateInventoryItemDto } from './dto/update-inventory.dto';
// import { CreateInventoryItemDto } from './dto/create-inventory.dto';

// @Controller('inventory')
// @UseGuards(JwtAuthGuard)
// export class InventoryController {
//   constructor(private readonly inventoryService: InventoryService) {}

//   @Post()
//   create(@Req() req, @Body() dto: CreateInventoryItemDto) {
//     return this.inventoryService.create(req.user.id, dto);
//   }

//   @Get()
//   findAll(@Query() query: InventoryQueryDto) {
//     return this.inventoryService.findAll(query);
//   }

//   @Get('summary')
//   getSummary(@Query('type') type: 'STOCK' | 'INVENTORY') {
//     return this.inventoryService.getSummary(type ?? 'STOCK');
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.inventoryService.findOne(id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() dto: UpdateInventoryItemDto) {
//     return this.inventoryService.update(id, dto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.inventoryService.remove(id);
//   }
// }