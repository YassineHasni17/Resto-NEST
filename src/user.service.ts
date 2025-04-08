// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './user.entity';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   // Recherche un utilisateur par email
//   async findOneByEmail(email: string): Promise<User | null> {
//     return await this.userRepository.findOne({ where: { email } });
//   }

//   // Création d'un utilisateur
//   async createUser(userData: Partial<User>): Promise<User> {
//     const user = this.userRepository.create(userData); // Création d'une instance User
//     return await this.userRepository.save(user); // Sauvegarde dans la base de données
//   }

//   // Mise à jour du mot de passe de l'utilisateur
//   async updatePassword(email: string, newPassword: string): Promise<User | null> {
//     const user = await this.findOneByEmail(email);
//     if (!user) {
//       return null; // Retourne null si l'utilisateur n'existe pas
//     }

//     // Hachage du nouveau mot de passe avant de l'enregistrer
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     return await this.userRepository.save(user); // Met à jour le mot de passe
//   }
// }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Recherche un utilisateur par email
  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  // Recherche un utilisateur par ID
  async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  // Création d'un utilis
  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  // Mise à jour du mot de passe de l'utilisateur
  async updatePassword(email: string, newPassword: string): Promise<User | null> {
    const user = await this.findOneByEmail(email);
    if (!user) {
      return null;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    return await this.userRepository.save(user);
  }

  // Sauvegarde du refresh token dans la BDD
  async saveRefreshToken(userId: number, token: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: token });
  }
}
