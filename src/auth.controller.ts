import { Controller, Post, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from './users/user.service';
import { EmailService } from './mail/email.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException("Utilisateur non trouvé");
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' },
    );

    console.log('Token généré :', token);

    await this.emailService.sendEmail(
      email,
      'Réinitialisation de mot de passe',
      token,
    );

    return { message: 'Email de réinitialisation envoyé avec succès.' };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; password: string }) {
    const { token, password } = body;

    if (!password || password.length < 6) {
      throw new BadRequestException("Le mot de passe doit contenir au moins 6 caractères.");
    }

    try {
      console.log('Token reçu :', token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { email: string };
      console.log('Payload décodé :', decoded);

      if (!decoded.email) {
        throw new BadRequestException("Le token est invalide.");
      }

      const user = await this.userService.findOneByEmail(decoded.email);
      if (!user) {
        throw new NotFoundException("Utilisateur non trouvé");
      }

      await this.userService.updatePassword(user.email, password);

      return { message: "Mot de passe réinitialisé avec succès" };
    } catch (err) {
      console.error('Erreur lors de la réinitialisation du mot de passe :', err);
      if (err.name === 'TokenExpiredError') {
        throw new BadRequestException("Le lien de réinitialisation a expiré. Veuillez en demander un nouveau.");
      } else if (err.name === 'JsonWebTokenError') {
        throw new BadRequestException("Le token est invalide.");
      } else {
        throw new BadRequestException("Une erreur est survenue lors de la réinitialisation du mot de passe.");
      }
    }
  }
}


