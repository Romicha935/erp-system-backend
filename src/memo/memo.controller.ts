import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { MemoService } from './memo.service';
import { CreateMemoDto } from './dto/create-memo.dto';
import { MemoActionDto } from './dto/memo-action.dto';
import { MemoQueryDto } from './dto/memo-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';


@Controller('memos')
@UseGuards(JwtAuthGuard)
export class MemoController {
  constructor(
    private readonly memoService: MemoService,
  ) {}

@Post()
create(
  @Req() req,
  @Body() dto: CreateMemoDto,
) {
  console.log('MEMO USER:', req.user);

  return this.memoService.create(
    req.user.id,
    dto,
  );
}             

  @Get()
  async findAll(
    @Req() req: any,
    @Query() query: MemoQueryDto,
  ) {
    return this.memoService.findAll(
      req.user.id,
      query,
    );
  }

  @Get(':id')
  async findOne(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return {
      data: await this.memoService.findOne(
        req.user.id,
        id,
      ),
    };
  }

  @Post(':id/action')
  async action(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: MemoActionDto,
  ) {
    return {
      message: 'Memo action updated successfully',
      data: await this.memoService.action(
        req.user.id,
        id,
        dto,
      ),
    };
  }

  @Delete(':id')
  async remove(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return {
      message: 'Memo deleted successfully',
      data: await this.memoService.remove(
        req.user.id,
        id,
      ),
    };
  }
}