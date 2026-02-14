import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const authAPI = {
    login: async (email: string, password: string) => {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        const response = await api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return response.data;
    },
    register: async (email: string, password: string, fullName: string) => {
        const response = await api.post('/auth/register', {
            email,
            password,
            full_name: fullName,
        });
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },
};

// Room endpoints
export const roomsAPI = {
    getAll: async () => {
        const response = await api.get('/rooms/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/rooms/${id}`);
        return response.data;
    },
    create: async (roomData: any) => {
        const response = await api.post('/rooms/', roomData);
        return response.data;
    },
    update: async (id: number, roomData: any) => {
        const response = await api.put(`/rooms/${id}`, roomData);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/rooms/${id}`);
        return response.data;
    },
};

// Room Types endpoints
export const roomTypesAPI = {
    getAll: async () => {
        const response = await api.get('/rooms/types/');
        return response.data;
    },
    create: async (typeData: any) => {
        const response = await api.post('/rooms/types/', typeData);
        return response.data;
    },
};

// Booking endpoints
export const bookingsAPI = {
    getAll: async () => {
        const response = await api.get('/bookings/');
        return response.data;
    },
    getMyBookings: async () => {
        const response = await api.get('/bookings/my');
        return response.data;
    },
    create: async (bookingData: any) => {
        const response = await api.post('/bookings/', bookingData);
        return response.data;
    },
    updateStatus: async (id: number, status: string) => {
        const response = await api.patch(`/bookings/${id}/status`, { status });
        return response.data;
    },
    cancel: async (id: number) => {
        const response = await api.delete(`/bookings/${id}`);
        return response.data;
    },
};

// Users endpoints (admin)
export const usersAPI = {
    getAll: async () => {
        const response = await api.get('/users/');
        return response.data;
    },
    updateRole: async (id: number, role: string) => {
        const response = await api.patch(`/users/${id}/role`, { role });
        return response.data;
    },
};

export default api;
