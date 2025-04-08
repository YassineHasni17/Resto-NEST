// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './user.entity';
// import { UserRole } from './user.entity';
// import { EmailService } from './mail/email.service'; // Importation de votre service d'email

// interface CreateUserDto {
//   name: string;
//   email: string;
//   password: string;
//   role?: UserRole;
//   telephone?: string; 
//   adresse?: string;  
// }

// @Injectable()
// export class AppService {
//   constructor(
//     @InjectRepository(User) private readonly userRepository: Repository<User>,
//     private readonly emailService: EmailService 
//   ) {}

//   async create(data: CreateUserDto): Promise<User> {
//     if (data.role && !Object.values(UserRole).includes(data.role)) {
//       throw new Error('Le rôle spécifié n\'est pas valide.');
//     }

//     const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
//     if (existingUser) {
//       throw new Error('Cet email est déjà utilisé.');
//     }

//     const user = this.userRepository.create(data); 
//     const savedUser = await this.userRepository.save(user);

//     // Envoi de l'email après la création de l'utilisateur
//     await this.emailService.sendEmail(
//       savedUser.email, 
//       'Confirmation d\'inscription', 
//       `Bonjour ${savedUser.name},\n\nMerci de vous être inscrit sur notre site !`
//     );

//     return savedUser;
//   }

//   async findOne(condition: any): Promise<User | null> {
//     if (!condition || Object.keys(condition).length === 0) {
//       throw new Error("Les conditions de recherche ne peuvent pas être vides.");
//     }

//     return this.userRepository.findOne({ where: condition });
//   }

//   async findAll(): Promise<User[]> {
//     return this.userRepository.find();
//   }
// }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from './user.entity';
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

  // Création  utilisa
  async create(data: CreateUserDto): Promise<User> {
    if (data.role && !Object.values(UserRole).includes(data.role)) {
      throw new Error("Le rôle spécifié n'est pas valide.");
    }

    const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé.');
    }

    const user = this.userRepository.create(data);
    const savedUser = await this.userRepository.save(user);

    // Envoi de l'email de confirmation
    await this.emailService.sendEmail(
      savedUser.email,
      "Confirmation d'inscription",
      `Bonjour ${savedUser.name},\n\nMerci de vous être inscrit sur notre site !`,
    );

    return savedUser;
  }

  // Recherche d'un utilisateur 
  async findOne(condition: Partial<User>): Promise<User | null> {
    if (!condition || Object.keys(condition).length === 0) {
      throw new Error("Les conditions de recherche ne peuvent pas être vides.");
    }
    return this.userRepository.findOne({ where: condition });
  }

  // Récupération utilisateurs
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
