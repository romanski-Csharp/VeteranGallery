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

export const getVeteranById = async (id: string) => {
    const response = await apiClient.get(`/veterans/${id}`);
    return response.data;
};

export const deleteVeteran = async (id: string) => {
    await apiClient.delete(`/veterans/${id}`);
};

export const updateVeteran = async (id: string, veteran: any) => {
    await apiClient.put(`/veterans/${id}`, veteran);
};