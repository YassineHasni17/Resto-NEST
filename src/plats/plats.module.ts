import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plat } from './plats.entity';
import { PlatsService } from './plats.service';
import { PlatsController } from './plats.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Plat])],
  controllers: [PlatsController],
  providers: [PlatsService],
})
export class PlatsModule {}
