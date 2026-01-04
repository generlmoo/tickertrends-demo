import { EntityRepository, Repository } from 'typeorm';
import { Trend } from '../entities/Trend';

@EntityRepository(Trend)
export class TrendRepository extends Repository<Trend> {
    async findAllOrderedByGrowth(): Promise<Trend[]> {
        return this.createQueryBuilder('trend')
            .orderBy('trend.growthPercentage', 'DESC')
            .getMany();
    }

    async findByTerm(term: string): Promise<Trend | undefined> {
        return this.findOne({ where: { term } });
    }

    async saveTrend(trendData: Partial<Trend>): Promise<Trend> {
        const trend = this.create(trendData);
        return this.save(trend);
    }
}