import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PayslipService } from './payslip.service';
import { CreatePayslipDto } from './dto/create-payslip.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePayslipDto } from './dto/update-payslip.dto';

@Controller('payslips')
@UseGuards(AuthGuard('jwt'))
export class PayslipController {
  constructor(
    private readonly payslipService: PayslipService,
  ) {}

  @Post()
  create(@Body() dto: CreatePayslipDto) {
    return this.payslipService.create(dto);
  }

    @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.payslipService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Get(':id')
async findOne(@Param('id') id: string) {
  return this.payslipService.findOne(id);
}

@Patch(':id')
update(
  @Param('id') id: string,
  @Body() dto: UpdatePayslipDto,
) {
  return this.payslipService.update(id, dto);
}

@Delete(':id')
remove(@Param('id') id: string) {
  return this.payslipService.remove(id);
}
}