import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'https://localhost:7130/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getVeterans = async (search?: string, branch?: number | null, sortBy?: string) => {
    const params = new URLSearchParams();

    if (search) params.append('search', search);
    if (branch !== null && branch !== undefined) params.append('branch', branch.toString());
    if (sortBy) params.append('sortBy', sortBy);

    const response = await apiClient.get(`/veterans?${params.toString()}`);
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