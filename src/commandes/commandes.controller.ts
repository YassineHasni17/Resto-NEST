import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { CreateCommandeDto, UpdateCommandeDto } from './commandes.dto';
import { Commande } from './commandes.entity';

@Controller('commandes')
export class CommandesController {
  constructor(private readonly commandesService: CommandesService) {}

  @Post()
  async create(@Body() createCommandeDto: CreateCommandeDto): Promise<Commande> {
    return this.commandesService.create(createCommandeDto);
  }

  @Get()
  async findAll(): Promise<Commande[]> {
    return this.commandesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Commande | null> {
    return this.commandesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCommandeDto: UpdateCommandeDto,
  ): Promise<Commande | null> {
    return this.commandesService.update(id, updateCommandeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.commandesService.remove(id);
  }
}
