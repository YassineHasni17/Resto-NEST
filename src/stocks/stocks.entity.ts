import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('stocks')
export class Stocks {
  @PrimaryGeneratedColumn()
  stock_id: number;

@Column({ type: 'varchar', length: 100, default: 'Inconnu' })
nomS: string;


@Column({ default: 0 })
quantite: number;

@Column({ type: 'varchar', length: 50, default: 'Inconnu' })
unite: string;


  @Column({ type: 'varchar', length: 100, nullable: true })
  categorie: string;

  @Column({ type: 'varchar', length: 100, nullable: true,default:0 })
  niveau: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  action: string;
}
