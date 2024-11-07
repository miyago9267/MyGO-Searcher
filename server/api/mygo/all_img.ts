import { jsonData } from '../../utils/dataLoader';
import { defineEventHandler } from 'h3';

const baseURL = 'https://drive.miyago9267.com/d/file/img/mygo/';
const data_mapping = Array.isArray(jsonData) ? jsonData : [];

export const getPicList = () => {
	try {
		const allFiles = data_mapping.map((item: any) => ({
			url: baseURL + item.file_name,
			alt: item.name,
		}));
		return { statusCode: 200, urls: allFiles };
	} catch (error) {
		return { statusCode: 400, error: 'Fail to fetch images library.' };
	}
};

export default defineEventHandler((event) => {
	return getPicList();
});
