import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface User {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  gender?: string;
  age?: number;
  skills?: string[];
  profileUrl?: string;
  about?: string;
}

export interface AuthResponse {
  message: string;
  data: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  fname: string;
  lname: string;
  email: string;
  password: string;
  gender: string;
  age: number;
  skills: string[];
  profileUrl?: string;
  about?: string;
}

export interface ProfileUpdateData {
  fname?: string;
  lname?: string;
  profileUrl?: string;
  skills?: string[];
  about?: string;
  age?: number;
}

export interface ConnectionRequest {
  _id: string;
  fromUserId: User;
  toUserId: User;
  status: 'like' | 'pass' | 'accepted' | 'rejected';
}

export const authService = {
  login: (data: LoginData) => api.post<AuthResponse>('/login', data),
  signup: (data: SignupData) => {
    const filteredData: Record<string, unknown> = {};
    (Object.keys(data) as Array<keyof SignupData>).forEach((key) => {
      const value = data[key];
      if (value !== undefined) {
        if (typeof value === 'string' && value.trim() === '') return;
        if (Array.isArray(value) && value.length === 0) return;
        filteredData[key] = value;
      }
    });
    return api.post<AuthResponse>('/signup', filteredData);
  },
  logout: () => api.post('/logout'),
};

export const profileService = {
  getProfile: () => api.get<{ data: User }>('/profile/view'),
  updateProfile: (data: ProfileUpdateData) => api.patch('/profile/edit', data),
  updatePassword: (password: string) => api.post('/password/edit', { password }),
};

export const connectionService = {
  sendLike: (userId: string) => api.post(`/request/send/like/${userId}`),
  sendPass: (userId: string) => api.post(`/request/send/pass/${userId}`),
  acceptRequest: (requestId: string) => api.post(`/request/receive/accepted/${requestId}`),
  rejectRequest: (requestId: string) => api.post(`/request/receive/rejected/${requestId}`),
};

export const userService = {
  getFeed: (page = 1, limit = 10) => api.get<{ data: User[] }>(`/user/feed?page=${page}&limit=${limit}`),
  getReceivedRequests: () => api.get<{ data: { _id: string; fromUserId: User }[] }>('/user/requests/received'),
  getConnections: () => api.get<{ data: User[] }>('/user/connections'),
};
