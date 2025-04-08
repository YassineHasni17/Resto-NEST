import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // Créer une réservation
  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  // Récupérer toutes les réservations
  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  // Récupérer une réservation par son ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.reservationService.findOne(id);
  }

  // Mettre à jour une réservation
  @Put(':id')
  update(@Param('id') id: number, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationService.update(id, updateReservationDto);
  }

  // Annuler une réservation
  @Post(':id/cancel')  
  cancel(@Param('id') id: number) {
    return this.reservationService.cancel(id);
  }
  @Put(':id/status')
updateStatus(@Param('id') id: number, @Body('status') status: string) {
  return this.reservationService.updateStatus(id, status);
}

  
}
