import { IsString, IsOptional, IsDecimal, IsPositive } from 'class-validator';

export class CreateMenuDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDecimal()
    @IsPositive()
    price: number;
}

export class UpdateMenuDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDecimal()
    @IsPositive()
    price?: number;
}