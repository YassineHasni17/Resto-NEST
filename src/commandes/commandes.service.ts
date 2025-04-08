import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commande } from './commandes.entity';
import { CreateCommandeDto, UpdateCommandeDto } from './commandes.dto';
import { User } from '../user.entity';  

@Injectable()
export class CommandesService {
  constructor(
    @InjectRepository(Commande)
    private readonly commandeRepository: Repository<Commande>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 
  ) {}

  async create(createCommandeDto: CreateCommandeDto): Promise<Commande> {
    
    const user = await this.userRepository.findOne({ where: { id: createCommandeDto.client_id } });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const commande = this.commandeRepository.create({
      ...createCommandeDto,
      client: user, 
    });

    return this.commandeRepository.save(commande);
  }

  async findAll(): Promise<Commande[]> {
    return this.commandeRepository.find({ relations: ['client'] });
  }

  async findOne(commande_id: number): Promise<Commande | null> {
    return this.commandeRepository.findOne({ where: { commande_id }, relations: ['client'] });
  }

  async update(commande_id: number, updateCommandeDto: UpdateCommandeDto): Promise<Commande | null> {
    await this.commandeRepository.update(commande_id, updateCommandeDto);
    return this.findOne(commande_id);
  }

  async remove(commande_id: number): Promise<void> {
    await this.commandeRepository.delete(commande_id);
  }
}
