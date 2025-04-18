import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UserRole } from '../users/user.entity';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

  // Créer une réservation
  @Roles(UserRole.User, UserRole.Admin)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createReservationDto: CreateReservationDto) {
    console.log('Données reçues :', createReservationDto);
    try {
      return await this.reservationService.create(createReservationDto);
    } catch (error) {
      console.error('Erreur lors de la création de la réservation :', error.message);
      throw new InternalServerErrorException('Erreur lors de la création de la réservation');
    }
  }
  // Récupérer toutes les réservations
  @Get()
  @Roles(UserRole.Admin)
  findAll() {
    return this.reservationService.findAll();
  }

  // Récupérer une réservation par son ID
  @Get(':id')
  @Roles(UserRole.Admin, UserRole.User)
  findOne(@Param('id') id: number) {
    return this.reservationService.findOne(id);
  }

  // Mettre à jour une réservation
  @Put(':id')
  @Roles(UserRole.Admin)
  update(@Param('id') id: number, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationService.update(id, updateReservationDto);
  }

  // Annuler une réservation
  @Post(':id/cancel')
  @Roles(UserRole.Admin, UserRole.User)
  cancel(@Param('id') id: number) {
    return this.reservationService.cancel(id);
  }

  // Mettre à jour le statut d'une réservation
  @Put(':id/status')
  @Roles(UserRole.Admin)
  updateStatus(@Param('id') id: number, @Body('status') status: string) {
    return this.reservationService.updateStatus(id, status);
  }
}
