import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { CreateStocksDto, UpdateStocksDto } from './stocks.dto';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UserRole } from '../users/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard) 
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) { }
  @Roles(UserRole.Admin)
  @Post()


  async create(@Body() createStocksDto: CreateStocksDto) {
    return this.stocksService.create(createStocksDto);
  }

  @Get()
  @Roles(UserRole.Admin) 
  async findAll() {
    return this.stocksService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.Admin)
  async findOne(@Param('id') id: number) {
    return this.stocksService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.Admin)
  async update(@Param('id') id: number, @Body() updateStocksDto: UpdateStocksDto) {
    return this.stocksService.update(id, updateStocksDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  async remove(@Param('id') id: number) {
    return this.stocksService.remove(id);
  }
}
