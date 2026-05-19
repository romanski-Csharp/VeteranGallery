import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'https://localhost:7130/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getVeterans = async () => {
    const response = await apiClient.get('/veterans');
    return response.data;
};