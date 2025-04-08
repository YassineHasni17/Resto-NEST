import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './menus.entity';
import { CreateMenuDto, UpdateMenuDto } from './menus.dto';

@Injectable()
export class MenusService {
    constructor(
        @InjectRepository(Menu)
        private readonly menusRepository: Repository<Menu>,
    ) {}

    async create(createMenuDto: CreateMenuDto): Promise<Menu> {
        const menu = this.menusRepository.create(createMenuDto);
        return await this.menusRepository.save(menu);
    }

    async findAll(): Promise<Menu[]> {
        return await this.menusRepository.find();
    }

    async findOne(id: number): Promise<Menu> {
        const menu = await this.menusRepository.findOne({ where: { id } });
        if (!menu) {
            throw new NotFoundException(`Menu avec l'ID ${id} introuvable`);
        }
        return menu;
    }

    async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
        await this.findOne(id);
        await this.menusRepository.update(id, updateMenuDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.menusRepository.delete(id);
    }
}