import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plat } from './plats.entity';
import { CreatePlatDto, UpdatePlatDto } from './plats.dto';


@Injectable()
export class PlatsService {
  constructor(
    @InjectRepository(Plat)
    private readonly platRepository: Repository<Plat>,
  ) {}

  async create(createPlatDto: CreatePlatDto): Promise<Plat> {
    const plat = this.platRepository.create(createPlatDto);
    return this.platRepository.save(plat);
  }

  async findOne(plat_id: number): Promise<Plat | null> {
    return this.platRepository.findOne({ where: { plat_id } });
  }

  async update(plat_id: number, updatePlatDto: UpdatePlatDto): Promise<Plat | null> {
    await this.platRepository.update(plat_id, updatePlatDto);
    return this.findOne(plat_id);
  }

  async remove(plat_id: number): Promise<void> {
    await this.platRepository.delete(plat_id);
  }

  async findAll(): Promise<Plat[]> {
    return this.platRepository.find();
  }

 
  async uploadImage(plat_id: number, image: Express.Multer.File): Promise<Plat> {
    const plat = await this.findOne(plat_id);
    if (!plat) {
      throw new Error('Plat non trouvé');
    }

   
    const base64Image = image.buffer.toString('base64');
    plat.image = base64Image;

    return this.platRepository.save(plat);
  }
}
