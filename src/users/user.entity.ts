import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Token } from '../token/token.entity';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export enum UserRole {
    Admin = "admin",
    User = "user"
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.User, 
    })
    role: UserRole;

    @Column({ nullable: true })
    telephone: string;  
    
    @Column({ nullable: true })
    adresse: string;  

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    date_creation: Date;

    @Column({ default: false })
    emailVerified: boolean;

    @Column({ nullable: true })
    refreshToken: string; 

    @OneToMany(() => Token, token => token.user)
    tokens: Token[];  
}

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;
}
