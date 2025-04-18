import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { TokenService } from '../token/token.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  findAuthUserById(sub: any) {
    throw new Error('Method not implemented.');
  }

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService, 
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }


  async findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    if (!userData.email) {
      throw new Error('Email is required to create a user');
    }
    const existingUser = await this.findOneByEmail(userData.email);
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }


  async updatePassword(email: string, newPassword: string): Promise<User | null> {
    const user = await this.findOneByEmail(email);
    if (!user) {
      return null;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    return await this.userRepository.save(user);
  }

  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.tokenService.createToken(userId, refreshToken, 7 * 24 * 60 * 60 * 1000);  // 7 jours
  }

  async revokeRefreshToken(userId: number): Promise<void> {
    const token = await this.tokenService.findValidToken(userId);
    if (token) {
      await this.tokenService.revokeToken(token.id);
    }
  }

  async findOne(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }
}
