import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/users/user.service';
import { TokenService } from 'src/token/token.service';
import { Request } from 'express';
import { isEmpty } from 'class-validator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,

  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('La clé JWT_SECRET est manquante dans les variables d\'environnement');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    });

    this.TokensService = this.tokenService;
  }

  private readonly TokensService: TokenService;

  async validate(request: Request) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    if (isEmpty(token)) {
      throw new UnauthorizedException();
    }
    const payload = await this.tokenService.verifyToken(token);


    const user = await this.userService.findOneById(payload);
    if (!user) {
      console.log('Utilisateur non trouvé pour l\'ID :', payload);
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    console.log('Utilisateur authentifié :', user);
    return { id: user.id, role: user.role };
  }
}