export const getAllImageList = async (query: string, config: any) => {
	let API_BASE_URL = config.public.API_BASE_URL;
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