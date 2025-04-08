import { IsInt, IsOptional, IsString, IsPositive } from 'class-validator';

export class CreateStocksDto {
  @IsString()
  nomS: string;  

  @IsInt()
  @IsPositive()
  quantite: number;  

  @IsString()
  unite: string; 

  @IsOptional()
  @IsString()
  categorie?: string;  

  @IsOptional()
  @IsString()
  niveau?: string;  

  @IsOptional()
  @IsString()
  action?: string;  
}

export class UpdateStocksDto {
  @IsOptional()
  @IsString()
  nomS?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  quantite?: number;

  @IsOptional()
  @IsString()
  unite?: string;

  @IsOptional()
  @IsString()
  categorie?: string;

  @IsOptional()
  @IsString()
  niveau?: string;

  @IsOptional()
  @IsString()
  action?: string;
}
