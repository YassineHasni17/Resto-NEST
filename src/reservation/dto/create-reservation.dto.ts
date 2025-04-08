import { IsString, IsNotEmpty, IsOptional, IsDateString, Validate, IsEnum } from 'class-validator';

// Validateur personnalisé pour le format de l'heure
export class IsTimeString {
  static validate(value: string): boolean {
    const regex = /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    return regex.test(value);
  }
}
export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
}

export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  @IsString()
  seatingPreference?: string;

  @IsOptional()
  @IsString()
  occasion?: string;

  @IsNotEmpty()
  @IsDateString()
  date: string; 

  @IsNotEmpty()
  @IsString()
  @Validate(IsTimeString)  
  time: string;  

  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus = ReservationStatus.PENDING; 
}
