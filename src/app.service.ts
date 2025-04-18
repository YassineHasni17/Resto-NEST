import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users/user.entity';
import { UserRole } from './users/user.entity';
import { EmailService } from './mail/email.service';

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  telephone?: string;
  adresse?: string;
}

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    if (data.role && !Object.values(UserRole).includes(data.role)) {
      throw new BadRequestException("Le rôle spécifié n'est pas valide.");
    }

    const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new BadRequestException('Cet email est déjà utilisé.');
    }

    const user = this.userRepository.create(data);
    const savedUser = await this.userRepository.save(user);

    try {
      await this.emailService.sendEmail(
        savedUser.email,
        "Confirmation d'inscription",
        `Bonjour ${savedUser.name},\n\nMerci de vous être inscrit sur notre site !`,
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email :", error);
    }

    return savedUser;
  }

  async findOne(condition: Partial<User>): Promise<User | null> {
    if (!condition || Object.keys(condition).length === 0) {
      throw new BadRequestException("Les conditions de recherche ne peuvent pas être vides.");
    }
    return this.userRepository.findOne({ where: condition });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
