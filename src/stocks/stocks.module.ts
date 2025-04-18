import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { Stocks } from './stocks.entity';
import { UserModule } from '../users/user.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Stocks]),
    UserModule, 
  ],
  controllers: [StocksController],
  providers: [StocksService],
})
export class StocksModule {}
