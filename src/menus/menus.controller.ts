import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto, UpdateMenuDto } from './menus.dto';

@Controller('menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) {}

    @Post()
    async create(@Body() createMenuDto: CreateMenuDto) {
        return this.menusService.create(createMenuDto);
    }

    @Get()
    async findAll() {
        return this.menusService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.menusService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateMenuDto: UpdateMenuDto) {
        return this.menusService.update(id, updateMenuDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.menusService.remove(id);
    }
}