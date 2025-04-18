import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation.entity';
import { UserModule } from '../users/user.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    UserModule, 
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
