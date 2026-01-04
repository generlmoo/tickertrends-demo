import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitTrends1704280000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "trends",
                columns: [
                    { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                    { name: "term", type: "varchar" },
                    { name: "date", type: "date" },
                    { name: "value", type: "float" },
                    { name: "growth_percentage", type: "float", default: 0 },
                    { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                    { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                ],
                uniques: [
                    {
                        name: "uniq_trend_term_date",
                        columnNames: ["term", "date"],
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("trends");
    }
}