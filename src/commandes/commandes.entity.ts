import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user.entity';

@Entity('commandes')
export class Commande {
  @PrimaryGeneratedColumn()
  commande_id: number;

  @ManyToOne(() => User) 
  @JoinColumn({ name: 'client_id' }) 
  client: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_commande: Date;

  @Column({ type: 'varchar', default: 'En cours' })
  statut: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;
    paiements: any;
}
