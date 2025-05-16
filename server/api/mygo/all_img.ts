import { jsonData } from '../../utils/dataLoader';
import { defineEventHandler } from 'h3';

const baseURL = useRuntimeConfig().NUXT_IMG_BASE_URL;
const data_mapping = Array.isArray(jsonData) ? jsonData : [];

export const getPicList = () => {
	try {
		const allFiles = data_mapping.map((item: any) => ({
			url: baseURL + item.file_name,
			alt: item.name,
			author: item.author,
			episode: item.episode,
		}));
		return { statusCode: 200, urls: allFiles };
	} catch (error) {
		return { statusCode: 400, error: 'Fail to fetch images library.' };
	}
};

export default defineEventHandler((event) => {
	return getPicList();
});
