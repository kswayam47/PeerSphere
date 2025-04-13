import api from './api';

export interface Notification {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  type: 'connection_request' | 'connection_accepted' | 'post_like' | 'post_comment';
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

class NotificationService {
  async getNotifications(page = 1, limit = 20): Promise<{ notifications: Notification[]; total: number }> {
    const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread/count');
    return response.data.count;
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  }

  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read/all');
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  }
}

export default new NotificationService(); 