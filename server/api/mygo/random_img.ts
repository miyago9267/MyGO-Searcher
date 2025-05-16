import { jsonData } from '../../utils/dataLoader'
import { defineEventHandler } from 'h3';

const baseURL = process.env.NUXT_IMG_BASE_URL;
const data_mapping = Array.isArray(jsonData) ? jsonData : [];

export const getRandomPic = (amount: number) => {
	try {
		if (amount > data_mapping.length) {
			throw new Error('Requested amount exceeds available images.');
		}
		const rngPics = data_mapping.sort(() => 0.5 - Math.random()).slice(0, amount);
		const picFiles = rngPics.map((item: any) => ({
			url: baseURL + item.file_name,
			alt: item.name,
		}));
		return { statusCode: 200, urls: picFiles };
	} catch (error) {
		console.error(error);
		return { statusCode: 400, error: 'Fail to fetch images library.' };
	}
};

export default defineEventHandler((event) => {
	const query = getQuery(event);
	const amount = parseInt(query.amount as string) || 1;
	return getRandomPic(amount);
});