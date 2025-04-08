import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { CreateStocksDto, UpdateStocksDto } from './stocks.dto';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Post()
  async create(@Body() createStocksDto: CreateStocksDto) {
    console.log(createStocksDto)
    return this.stocksService.create(createStocksDto);
  }

  @Get()
  async findAll() {
    return this.stocksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.stocksService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateStocksDto: UpdateStocksDto) {
    return this.stocksService.update(id, updateStocksDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.stocksService.remove(id);
  }
}
