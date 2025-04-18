import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatsController } from './plats.controller';
import { PlatsService } from './plats.service';
import { Plat } from './plats.entity';
import { UserModule } from '../users/user.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Plat]),
    UserModule, 
  ],
  controllers: [PlatsController],
  providers: [PlatsService],
})
export class PlatsModule {}
