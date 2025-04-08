import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateContactDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    message: string;
}