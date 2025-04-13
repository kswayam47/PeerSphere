import api from './api';
import { User } from './auth';

export interface UpdateProfileData {
  name?: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

class UserService {
  async getProfile(): Promise<User> {
    const response = await api.get('/users/profile');
    return response.data;
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put('/users/profile', data);
    return response.data;
  }

  async uploadAvatar(file: File): Promise<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default new UserService(); 