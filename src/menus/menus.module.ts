import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';
import { Menu } from './menus.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Menu]), 
    ],
    controllers: [MenusController],
    providers: [MenusService],
})
export class MenusModule {}