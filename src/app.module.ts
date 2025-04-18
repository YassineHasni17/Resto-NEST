import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { PlatsModule } from './plats/plats.module';
import { StocksModule } from './stocks/stocks.module';
import { MenusModule } from './menus/menus.module';
import { ContactModule } from './contact/contact.module';
import { ReservationModule } from './reservation/reservation.module';
import { EmailService } from './mail/email.service';
import { AuthController } from './auth.controller';
import { TokenModule } from './token/token.module';
import { TokenService } from './token/token.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { User } from './users/user.entity';
import { MailModule } from './mail/email.module';
import { JwtAuthGuard } from './auth/auth.guard';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles/roles.guard';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
   
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Yassine123', 
      database: 'yt_nest_auth',
      synchronize: true,
      autoLoadEntities: true,
      entities: [
        `${process.env.NODE_ENV === 'test' ? 'src' : 'dist'}/**/**.entity{.ts,.js}`,
      ],
    }),
    TypeOrmModule.forFeature([User]),
    TokenModule, 
    PlatsModule,
    StocksModule,
    MenusModule,
    ContactModule,
    ReservationModule,
    MailModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1d' },
      global:true,
    }),
    PassportModule 
  ],
  controllers: [AppController, AuthController],  
  providers: [
    AppService,
    JwtStrategy,
    

  ],
})
export class AppModule {}
