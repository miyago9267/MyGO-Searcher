
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getAllImageList = async (query: string) => {
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