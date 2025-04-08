import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  // Cr Reser
  create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const reservation = this.reservationRepository.create(createReservationDto);
    return this.reservationRepository.save(reservation);
  }

  // Rec reser
  findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find();
  }

  // Rec reser ID
  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  // updt res
  async update(id: number, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.reservationRepository.preload({
      id: id,
      ...updateReservationDto,
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return this.reservationRepository.save(reservation);
  }

  // Anl reser
  async cancel(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    // status de res
    reservation.status = 'cancelled';
    return this.reservationRepository.save(reservation);
  }
  async updateStatus(id: number, status: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    
    if (!reservation) {
      throw new NotFoundException(`Réservation avec l'ID ${id} introuvable`);
    }
  
    reservation.status = status;
    return this.reservationRepository.save(reservation);
  }
  
 
}
