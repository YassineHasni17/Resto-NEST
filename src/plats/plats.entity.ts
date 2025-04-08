import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Plat {
  @PrimaryGeneratedColumn()
  plat_id: number;

  @Column()
  nom: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  prix: number;

  @Column({ nullable: true })
  categorie: string;

  @Column({ default: true })
  disponible: boolean;

  @Column({ type: 'text', nullable: true })
  image: string; 
}
