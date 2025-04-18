import { Injectable } from '@nestjs/common';
import { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly brevoApiKey = process.env.BREVO_API_KEY!;
  private readonly frontendResetUrl = 'http://localhost:3000/reset-password';

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }


  generateResetToken(email: string): string {
    const token = this.jwtService.sign(
      { email },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1h',
      }
    );
    return token;
  }


  verifyResetToken(token: string): string {
    try {
      const decoded: any = this.jwtService.verify(token, this.configService.get('JWT_SECRET'));
      return decoded.email;
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }
  }


  async sendEmail(to: string, subject: string, token: string): Promise<void> {
    const apiInstance = new TransactionalEmailsApi();
    apiInstance.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      this.brevoApiKey
    );

    const resetLink = `${this.frontendResetUrl}?token=${token}`;

    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Réinitialisation du mot de passe</h2>
        <p>Bonjour,</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous :</p>
        <a href="${resetLink}" style="display:inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Modifier mon mot de passe</a>
        <p>Ou copiez-collez ce lien dans votre navigateur :</p>
        <p>${resetLink}</p>
        <br>
        <p>Ce lien est valable pendant 1 heure.</p>
      </div>
    `;
    sendSmtpEmail.sender = {
      name: 'DarTassnime',
      email: 'yassine10hasni10@gmail.com',
    };
    sendSmtpEmail.to = [{ email: to }];

    try {
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('✅ Email envoyé avec succès:', result);
    } catch (error) {
      console.error('❌ Erreur lors de l’envoi de l’email :', error);
      throw new Error('Échec de l’envoi de l’e-mail de réinitialisation');
    }
  }
}
