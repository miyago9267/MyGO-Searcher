import { getJsonData } from '../../utils/dataLoader';
import { defineEventHandler } from 'h3';

const baseURL = useRuntimeConfig().NUXT_IMG_BASE_URL;

export const getPicList = async () => {
	try {
		const data_mapping = await getJsonData();
		const allFiles = data_mapping.map((item: any) => ({
			url: baseURL + item.filename,
			alt: item.alt,
			author: item.author,
			episode: item.episode,
		}));
		return { statusCode: 200, urls: allFiles };
	} catch (error) {
		return { statusCode: 400, error: 'Fail to fetch images library.' };
	}
};

export default defineEventHandler(async(event) => {
	return await getPicList();
});
