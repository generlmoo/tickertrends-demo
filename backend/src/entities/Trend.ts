import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'trends' })
export class Trend {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar' })
    term!: string;

    @Column({ type: 'date' })
    date!: string;

    @Column({ type: 'float' })
    value!: number;

    @Column({ type: 'float', name: 'growth_percentage', default: 0 })
    growthPercentage!: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}