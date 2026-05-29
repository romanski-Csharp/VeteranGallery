import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'https://localhost:7130/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Decode the JWT exp claim and clear the token if it's already expired.
// This runs immediately on module load so the app boots in the correct state
// even before any API call is made (e.g. on a hard page refresh).
const checkAndClearExpiredToken = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
        // JWT payload is the second base64url segment
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        // exp is Unix seconds; Date.now() is milliseconds
        if (payload.exp && Date.now() >= payload.exp * 1000) {
            localStorage.removeItem('adminToken');
        }
    } catch {
        // Malformed token — remove it to be safe
        localStorage.removeItem('adminToken');
    }
};

checkAndClearExpiredToken();

// Attach the Bearer token to every outgoing request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// If the server returns 401 (expired or invalid token), auto-logout immediately.
// This covers edge cases the client-side check cannot (e.g. server clock skew,
// token revoked server-side, or a malformed payload that slipped through).
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const hadToken = !!localStorage.getItem('adminToken');
            localStorage.removeItem('adminToken');
            // Only reload if we were actually logged in — avoids a reload loop
            // on public endpoints that legitimately return 401.
            if (hadToken) {
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

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

export const addVeteranDirect = async (veteranData: any) => {
    const response = await apiClient.post('/veterans', veteranData);
    return response.data;
};

export const submitProposal = async (veteranData: any, isUpdate: boolean) => {
    const response = await apiClient.post(`/proposals?isUpdate=${isUpdate}`, veteranData);
    return response.data;
};

export const getProposals = async (status: number = 1) => {
    const response = await apiClient.get(`/proposals?status=${status}`);
    return response.data;
};

export const restoreProposal = async (id: string) => {
    const response = await apiClient.post(`/proposals/${id}/restore`);
    return response.data;
};

export const getComparison = async (id: string) => {
    const response = await apiClient.get(`/proposals/${id}/compare`);
    return response.data;
};

export const approveProposal = async (id: string) => {
    const response = await apiClient.post(`/proposals/${id}/approve`);
    return response.data;
};

export const rejectProposal = async (id: string) => {
    const response = await apiClient.post(`/proposals/${id}/reject`);
    return response.data;
};

export const loginAdmin = async (credentials: { username: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
    }
    return response.data;
};

export const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
};