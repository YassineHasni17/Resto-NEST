import { Controller, Post, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service'; // Assurez-vous que le service utilisateur est bien importé
import { EmailService } from './mail/email.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService
  ) {}


  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const token = this.emailService.generateResetToken(email);
  
    await this.emailService.sendEmail(email, 'Réinitialisation de mot de passe', token);
  
    return { message: 'Email de réinitialisation envoyé avec succès.' };
  }
  

  @Post('reset-password')
async resetPassword(@Body() body: { token: string; password: string }) {
  const { token, password } = body;

  try {
    const decoded = jwt.verify(token, 'SECRET_KEY') as { email: string };
    const user = await this.userService.findOneByEmail(decoded.email);

    if (!user) {
      throw new NotFoundException("Utilisateur non trouvé");
    }

    await this.userService.updatePassword(user.email, password); 

    return { message: "Mot de passe réinitialisé avec succès" };
  } catch (err) {
    console.log(err)
    throw new BadRequestException("Lien invalide ou expiré.");
  }
}

}
