import { IsString, IsNumber, IsOptional, IsBoolean, IsUrl } from 'class-validator';

export class CreatePlatDto {
  @IsString()
  nom: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  prix: number;

  @IsOptional()
  @IsString()
  categorie: string;

  @IsBoolean()
  @IsOptional()
  disponible: boolean;

  @IsOptional()
  @IsString()
  @IsUrl() 
  image: string; 
}

export class UpdatePlatDto {
  @IsOptional()
  @IsString()
  nom: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  prix: number;

  @IsOptional()
  @IsString()
  categorie: string;

  @IsOptional()
  @IsBoolean()
  disponible: boolean;

  @IsOptional()
  @IsString()
  @IsUrl() 
  image: string; 
}
