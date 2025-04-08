import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commande } from './commandes.entity'; 
import { CommandesController } from './commandes.controller'; 
import { CommandesService } from './commandes.service'; 
import { AppModule } from 'src/app.module';

@Module({
  imports: [TypeOrmModule.forFeature([Commande]), AppModule], 
  controllers: [CommandesController], 
  providers: [CommandesService], 
})
export class CommandesModule {}

