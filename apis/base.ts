import { useRuntimeConfig } from '#app'

export const getAllImageList = async (query: string) => {
	const config = useRuntimeConfig();
	const API_BASE_URL = config.public.apiBase;

	try {
		let url = '';
		if (query) {
			url = `${API_BASE_URL}/img?keyword=${query}`;
		} else {
			url = `${API_BASE_URL}/all_img`;
		}
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		return data.urls;
	} catch (error) {
		console.error('Error fetching data: ', error);
		return [];
	}
};