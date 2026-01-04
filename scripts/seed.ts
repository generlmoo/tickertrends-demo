import { createConnection } from 'typeorm';
import { Trend } from '../backend/src/entities/Trend';
import fetch from 'node-fetch';

const seedData = async () => {
    const connection = await createConnection();
    const trendRepository = connection.getRepository(Trend);

    // Example keywords to seed
    const keywords = ['crocs', 'nike', 'adidas'];
    const startDate = '2020-02-24';
    const endDate = '2025-02-24';

    for (const keyword of keywords) {
        const response = await fetch(`https://muckrack.com/trends/report/data/?terms=%22${keyword}%22&daterange_starts=${startDate}&daterange_ends=${endDate}`);
        const data = await response.json();

        // Assuming data contains an array of trends
        for (const trend of data) {
            const newTrend = trendRepository.create({
                term: keyword,
                date: trend.date,
                value: trend.value,
                growth: trend.growth,
            });
            await trendRepository.save(newTrend);
        }
    }

    await connection.close();
};

seedData().catch(error => {
    console.error('Error seeding data:', error);
});