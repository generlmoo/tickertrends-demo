import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTermsTable1704280000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'terms',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'term', type: 'varchar', isNullable: false, isUnique: true },
                    { name: 'last_scrape_status', type: 'int', isNullable: true },
                    { name: 'last_scrape_error', type: 'text', isNullable: true },
                    { name: 'created_at', type: 'timestamp', default: 'now()' },
                    { name: 'updated_at', type: 'timestamp', default: 'now()' },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('terms');
    }
}
