import { Controller, Post, Body, Res, Req, UnauthorizedException, BadRequestException, Get, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './users/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from './users/user.entity';
import { EmailService } from './mail/email.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from './auth/auth.guard';
import { TokenService } from './token/token.service';
import { RolesGuard } from './auth/roles/roles.guard';
import { Roles } from './auth/roles/roles.decorator';

@Controller('api')

export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) { }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request) {
    const user = req['user'];
    
    const userData = await this.userService.findOneById((user as any).id);
    if (!userData) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }
    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
    };
  }
  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: UserRole = UserRole.User,
    @Body('telephone') telephone: string,
    @Body('adresse') adresse: string,
  ) {
    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException("Cet email est déjà utilisé.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.userService.createUser({
      name,
      email,
      password: hashedPassword,
      role,
      telephone,
      adresse,
    });

    try {
      await this.emailService.sendEmail(email, "Bienvenue", "Votre inscription est confirmée.");
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email :", error);
    }

    const { password: _, ...result } = user;
    return result;
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Email ou mot de passe incorrect.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Email ou mot de passe incorrect.');
    }

    try {
      const accessToken = await this.jwtService.signAsync(
        { id: user.id, role: user.role },
        { expiresIn: '15m' },
      );

      const refreshToken = await this.jwtService.signAsync(
        { id: user.id },
        { expiresIn: '7d' },
      );

      await this.tokenService.createToken(user.id, refreshToken, 7 * 24 * 60 * 60 * 1000);
      await this.userService.saveRefreshToken(user.id, refreshToken);

      response.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      return {
        message: 'Connexion réussie',
        accessToken,
        refreshToken,
        role: user.role,
      };
    } catch (error) {
      throw new BadRequestException('Erreur lors de la connexion');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) response: Response) {
    const user = req['user'];

    try {
      await this.tokenService.revokeAllTokens(user.id);
      response.clearCookie('jwt');
      return { message: 'Déconnecté avec succès. Tous les tokens sont révoqués.' };
    } catch (error) {
      throw new BadRequestException('Erreur lors de la déconnexion');
    }
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.userService.findOneById(payload.id);

      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }

      const validToken = await this.tokenService.findValidToken(user.id);
      if (!validToken || validToken.token !== refreshToken) {
        throw new UnauthorizedException('Token révoqué ou invalide');
      }

      const newAccessToken = await this.jwtService.signAsync(
        { id: user.id, role: user.role },
        { expiresIn: '15m' },
      );

      const newRefreshToken = await this.jwtService.signAsync(
        { id: user.id },
        { expiresIn: '7d' },
      );

      await this.tokenService.revokeAllTokens(user.id);
      await this.tokenService.createToken(user.id, newRefreshToken, 7 * 24 * 60 * 60 * 1000);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
  @Get('admin-data')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  async getAdminData() {
    return { message: 'Données réservées aux administrateurs' };
  }

  @Get('user-data')
  @UseGuards(RolesGuard)
  @Roles(UserRole.User)
  async getUserData() {
    return { message: 'Données réservées aux utilisateurs' };
  }
}
