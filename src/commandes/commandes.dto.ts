import { IsString, IsNumber, IsOptional, IsDate, IsEnum } from 'class-validator';

export class CreateCommandeDto {
  @IsNumber()
  client_id: number; 

  @IsOptional()
  @IsDate()
  date_commande: Date;

  @IsOptional()
  @IsString()
  @IsEnum(['En cours', 'Terminé', 'Servi'])
  statut: string;

  @IsNumber()
  total: number;
}

export class UpdateCommandeDto {
  @IsOptional()
  @IsString()
  @IsEnum(['En cours', 'Terminé', 'Servi'])
  statut: string;

  @IsOptional()
  @IsNumber()
  total: number;
}
