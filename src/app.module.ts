import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PlatsModule } from './plats/plats.module';
import { StocksModule } from './stocks/stocks.module';
import { MenusModule } from './menus/menus.module';
import { ContactModule } from './contact/contact.module';
import { ReservationModule } from './reservation/reservation.module';
import { EmailService } from './mail/email.service';
import { AuthController } from './auth.controller';
import { UserService } from './user.service';
import { MailModule } from './mail/email.module';



@Module({
  imports: [
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
    PlatsModule,
    StocksModule,
    MenusModule,
    ContactModule,
    ReservationModule,
    JwtModule.register({
      secret:'secret',
      signOptions:{expiresIn:'1d'}
    }),
  
  ],
  controllers: [AppController,AuthController],
  providers: [AppService,UserService,EmailService],
})
export class AppModule {}
