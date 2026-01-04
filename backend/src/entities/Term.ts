import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'terms' })
@Unique(['term'])
export class Term {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar' })
    term!: string;

    @Column({ type: 'int', name: 'last_scrape_status', nullable: true })
    lastScrapeStatus: number | null = null;

    @Column({ type: 'text', name: 'last_scrape_error', nullable: true })
    lastScrapeError: string | null = null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
