import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto, UpdateMenuDto } from './menus.dto';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UserRole } from '../users/user.entity';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @Roles(UserRole.Admin) 
  async create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.User) 
  async findAll() {
    return this.menusService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.Admin, UserRole.User) 
  async findOne(@Param('id') id: number) {
    return this.menusService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.Admin) 
  async update(@Param('id') id: number, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin) 
  async remove(@Param('id') id: number) {
    return this.menusService.remove(id);
  }
}