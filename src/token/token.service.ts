import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './token.entity';
import { User } from 'src/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,

  ) { }

  async findValidToken(userId: number): Promise<Token | null> {
    return await this.tokenRepository.findOne({
      where: { user: { id: userId }, revoked: false },
      order: { expiresAt: 'DESC' },
    });
  }

  async createToken(userId: number, token: string, expiresIn: number): Promise<Token> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const tokenEntity = this.tokenRepository.create({
      token,
      expiresAt: new Date(Date.now() + expiresIn),
      revoked: false,
      user,
    });

    return await this.tokenRepository.save(tokenEntity);
  }

  async revokeToken(tokenId: number): Promise<void> {
    const token = await this.tokenRepository.findOne({ where: { id: tokenId } });
    if (!token) {
      throw new Error('Token non trouvé');
    }

    token.revoked = true;
    await this.tokenRepository.save(token);
  }

  async revokeAllTokens(userId: number): Promise<void> {
    const tokens = await this.tokenRepository.find({
      where: { user: { id: userId }, revoked: false },
    });

    for (const token of tokens) {
      token.revoked = true;
      await this.tokenRepository.save(token);
    }
  }

  async verifyToken(token: any): Promise<number> {
    const validatedPayload = this.jwtService.verify(
      token,
      {
        secret: this.configService.get("JWT_SECRET"),
      },
    );
    const tokenEntity = await this.tokenRepository.exists({
      where: { token, revoked: true },
    });

    if (tokenEntity) {
      throw new Error()
    }

    return validatedPayload.id;
  }
}