import api from './api';
import { User } from './auth';

export interface Connection {
  _id: string;
  user: User;
  status: 'pending' | 'accepted';
  createdAt: string;
  updatedAt: string;
}

class ConnectionService {
  async getConnections(): Promise<Connection[]> {
    const response = await api.get('/connections');
    return response.data;
  }

  async getPendingConnections(): Promise<Connection[]> {
    const response = await api.get('/connections/pending');
    return response.data;
  }

  async sendConnectionRequest(userId: string): Promise<Connection> {
    const response = await api.post(`/connections/${userId}`);
    return response.data;
  }

  async acceptConnectionRequest(connectionId: string): Promise<Connection> {
    const response = await api.put(`/connections/${connectionId}/accept`);
    return response.data;
  }

  async rejectConnectionRequest(connectionId: string): Promise<void> {
    await api.put(`/connections/${connectionId}/reject`);
  }

  async removeConnection(connectionId: string): Promise<void> {
    await api.delete(`/connections/${connectionId}`);
  }

  async searchUsers(query: string): Promise<User[]> {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
}

export default new ConnectionService(); 