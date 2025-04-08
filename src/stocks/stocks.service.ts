import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stocks } from './stocks.entity';
import { CreateStocksDto, UpdateStocksDto } from './stocks.dto';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(Stocks)
    private readonly stocksRepository: Repository<Stocks>,
  ) {}

  async create(createStocksDto: CreateStocksDto): Promise<Stocks> {
    console.log(createStocksDto)
    const stock = this.stocksRepository.create(createStocksDto);
    return await this.stocksRepository.save(stock);
  }

  async findAll(): Promise<Stocks[]> {
    return await this.stocksRepository.find();
  }

  async findOne(id: number): Promise<Stocks> {
    const stock = await this.stocksRepository.findOne({ where: { stock_id: id } });
    if (!stock) {
      throw new NotFoundException(`Stock avec l'ID ${id} introuvable`);
    }
    return stock;
  }

  async update(id: number, updateStocksDto: UpdateStocksDto): Promise<Stocks> {
    await this.findOne(id);
    await this.stocksRepository.update(id, updateStocksDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.stocksRepository.delete(id);
  }
}
