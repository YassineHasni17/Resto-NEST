import { IsString, IsOptional, IsDateString, Validate, IsEnum } from 'class-validator';
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

export class UpdateReservationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  @IsString()
  seatingPreference?: string;

  @IsOptional()
  @IsString()
  occasion?: string;

  @IsOptional()
  @IsDateString()
  date?: string;  

  @IsOptional()
  @IsString()
  @Validate(IsTimeString)  
  time?: string;  

  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;  
}
