const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33254993-061d896ec6732e6df17c8cb18';

export function getImages(searchTitle, page = 1) {
	return fetch(`${BASE_URL}?q=${searchTitle}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`)

}