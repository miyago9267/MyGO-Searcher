import { getJsonData } from '../../utils/dataLoader'
import { defineEventHandler } from 'h3';

const baseURL = useRuntimeConfig().NUXT_IMG_BASE_URL;

export const getRandomPic = async (amount: number) => {
	try {
		const data_mapping = await getJsonData();
		if (amount > data_mapping.length) {
			throw new Error('Requested amount exceeds available images.');
		}
		const rngPics = data_mapping.sort(() => 0.5 - Math.random()).slice(0, amount);
		const picFiles = rngPics.map((item: any) => ({
			url: baseURL + item.filename,
			alt: item.name,
		}));
		return { statusCode: 200, urls: picFiles };
	} catch (error) {
		console.error(error);
		return { statusCode: 400, error: 'Fail to fetch images library.' };
	}
};

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const amount = parseInt(query.amount as string) || 1;
	return getRandomPic(amount);
});