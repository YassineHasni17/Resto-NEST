// import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
// import { PlatsService } from './plats.service';
// import { CreatePlatDto, UpdatePlatDto } from './plats.dto';
// import { Plat } from './plats.entity';

// @Controller('plats')
// export class PlatsController {
//   constructor(private readonly platsService: PlatsService) {}

//   @Post()
//   async create(@Body() createPlatDto: CreatePlatDto): Promise<Plat> {
//     return this.platsService.create(createPlatDto);
//   }

//   @Get()
//   async findAll(): Promise<Plat[]> {
//     return this.platsService.findAll();
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: number): Promise<Plat | null> {
//     return this.platsService.findOne(id);
//   }

//   @Put(':id')
//   async update(
//     @Param('id') id: number,
//     @Body() updatePlatDto: UpdatePlatDto,
//   ): Promise<Plat | null> {
//     return this.platsService.update(id, updatePlatDto);
//   }

//   @Delete(':id')
//   async remove(@Param('id') id: number): Promise<void> {
//     return this.platsService.remove(id);
//   }
// }
// import { Controller, Post, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
// import { PlatsService } from './plats.service';
// import { FileInterceptor } from '@nestjs/platform-express';

// @Controller('plats')
// export class PlatsController {
//   constructor(private readonly platsService: PlatsService) {}

//   @Post(':plat_id/upload')
//   @UseInterceptors(FileInterceptor('image'))
//   async uploadImage(
//     @Param('plat_id') plat_id: number,
//     @UploadedFile() image: Express.Multer.File,
//   ) {
//     return this.platsService.uploadImage(plat_id, image);
//   }
// }



import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PlatsService } from './plats.service';
import { CreatePlatDto, UpdatePlatDto } from './plats.dto';
import { Plat } from './plats.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('plats')
export class PlatsController {
  constructor(private readonly platsService: PlatsService) {}


  @Post()
  async create(@Body() createPlatDto: CreatePlatDto): Promise<Plat> {
    return this.platsService.create(createPlatDto);
  }


  @Get()
  async findAll(): Promise<Plat[]> {
    return this.platsService.findAll();
  }


  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Plat | null> {
    return this.platsService.findOne(id);
  }


  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePlatDto: UpdatePlatDto,
  ): Promise<Plat | null> {
    return this.platsService.update(id, updatePlatDto);
  }


  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.platsService.remove(id);
  }


  @Post(':plat_id/upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('plat_id') plat_id: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.platsService.uploadImage(plat_id, image);
  }
}
