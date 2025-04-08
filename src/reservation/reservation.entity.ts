import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  specialRequests: string;

  @Column({ default: "indifferent" })
  seatingPreference: string;

  @Column({ default: "Aucune occasion spéciale" })
  occasion: string;

  @Column({ type: 'date' })
  date: string; 

  @Column({ type: 'time' })
  time: string; 
  @Column({ default: 'confirmed' })  
  status: string;
}
