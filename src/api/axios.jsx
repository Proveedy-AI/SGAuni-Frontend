import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL;

export default axios.create({
	baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
});
