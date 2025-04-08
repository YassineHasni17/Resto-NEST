import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('menus')
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, default: 'Inconnu' })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number;
}