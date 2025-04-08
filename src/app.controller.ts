// import { 
//   BadRequestException, 
//   Body, 
//   Controller, 
//   Get, 
//   Post, 
//   Req, 
//   Res, 
//   UnauthorizedException 
// } from '@nestjs/common';
// import { UserService } from './user.service';
// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { Response, Request } from 'express';
// import { UserRole } from './user.entity';
// import { EmailService } from './mail/email.service';

// @Controller('api')
// export class AppController {
//   getHello(): any {
//     throw new Error('Method not implemented.');
//   }
//   constructor(
//     private readonly userService: UserService, 
//     private readonly emailService: EmailService,
//     private jwtService: JwtService
//   ) {}

//   @Post('register')
//   async register(
//     @Body('name') name: string,
//     @Body('email') email: string,
//     @Body('password') password: string,
//     @Body('role') role: UserRole = UserRole.User,
//     @Body('telephone') telephone: string,
//     @Body('adresse') adresse: string
//   ) {
//     const existingUser = await this.userService.findOneByEmail(email);
//     if (existingUser) {
//       throw new BadRequestException("Cet email est déjà utilisé.");
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);
//     const user = await this.userService.createUser({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       telephone,
//       adresse,
//     });
//     await this.emailService.sendEmail(email, "Bienvenue", "Votre inscription est confirmée.");

//     const { password: _, ...result } = user;
//     return result;
//   }

//   @Post('login')
//   async login(
//     @Body('email') email: string,
//     @Body('password') password: string,
//     @Res({ passthrough: true }) response: Response
//   ) {
//     const user = await this.userService.findOneByEmail(email);
//     if (!user) {
//       throw new BadRequestException('Email ou mot de passe incorrect.');
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       throw new BadRequestException('Email ou mot de passe incorrect.');
//     }

//     const jwt = await this.jwtService.signAsync(
//       { id: user.id, role: user.role },
//       { expiresIn: '24h' }
//     );

//     response.cookie('jwt', jwt, { 
//       httpOnly: true, 
//       secure: true, 
//       sameSite: 'strict' 
//     });

//     return {
//       message: 'Connexion réussie',
//       role: user.role
//     };
//   }

//   @Get('user')
//   async user(@Req() request: Request) {
//     try {
//       const cookie = request.cookies['jwt'];
//       if (!cookie) throw new UnauthorizedException("JWT manquant.");

//       const data = await this.jwtService.verifyAsync(cookie);
//       if (!data) throw new UnauthorizedException("JWT invalide.");

//       const user = await this.userService.findOneByEmail(data.email);
//       if (!user) throw new UnauthorizedException("Utilisateur non trouvé.");

//       const { password, ...result } = user;
//       return result;
//     } catch (e) {
//       throw new UnauthorizedException("Accès refusé.");
//     }
//   }

//   @Post('logout')
//   async logout(@Res({ passthrough: true }) response: Response) {
//     response.clearCookie('jwt');
//     return { message: 'Déconnexion réussie' };
//   }
// }

import { Controller, Post, Body, Res, Req, UnauthorizedException, BadRequestException, Get } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from './user.entity';
import { EmailService } from './mail/email.service';
import * as bcrypt from 'bcrypt';

@Controller('api')
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}


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

    await this.emailService.sendEmail(email, "Bienvenue", "Votre inscription est confirmée.");

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

  
    const accessToken = await this.jwtService.signAsync(
      { id: user.id, role: user.role },
      { expiresIn: '15m' },
    );

    const refreshToken = await this.jwtService.signAsync(
      { id: user.id },
      { expiresIn: '7d' },
    );

    await this.userService.saveRefreshToken(user.id, refreshToken);

    // Envoi de l'access token en tant que cookie HTTP-only
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
  }

  @Get('user')
  async user(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      if (!cookie) throw new UnauthorizedException("JWT manquant.");

      const data = await this.jwtService.verifyAsync(cookie);
      if (!data) throw new UnauthorizedException("JWT invalide.");

      const user = await this.userService.findOneByEmail(data.email);
      if (!user) throw new UnauthorizedException("Utilisateur non trouvé.");

      const { password, ...result } = user;
      return result;
    } catch (e) {
      throw new UnauthorizedException("Accès refusé.");
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { message: 'Déconnexion réussie' };
  }

  // rafraichissement du token
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.userService.findOneById(payload.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Token invalide');
      }

      // nouvel access token
      const newAccessToken = await this.jwtService.signAsync(
        { id: user.id, role: user.role },
        { expiresIn: '15m' },
      );

      //  nouveau refresh token
      const newRefreshToken = await this.jwtService.signAsync(
        { id: user.id },
        { expiresIn: '7d' },
      );

      // nouveau refresh token dans la base de données
      await this.userService.saveRefreshToken(user.id, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
