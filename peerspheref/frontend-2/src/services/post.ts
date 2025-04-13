import api from './api';

export interface Post {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  content: string;
  images?: string[];
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  content: string;
  images?: File[];
}

export interface CreateCommentData {
  content: string;
}

class PostService {
  async getPosts(page = 1, limit = 10): Promise<{ posts: Post[]; total: number }> {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getPost(id: string): Promise<Post> {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  }

  async createPost(data: CreatePostData): Promise<Post> {
    const formData = new FormData();
    formData.append('content', data.content);
    
    if (data.images) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deletePost(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  }

  async likePost(id: string): Promise<Post> {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  }

  async unlikePost(id: string): Promise<Post> {
    const response = await api.post(`/posts/${id}/unlike`);
    return response.data;
  }

  async createComment(postId: string, data: CreateCommentData): Promise<Comment> {
    const response = await api.post(`/posts/${postId}/comments`, data);
    return response.data;
  }

  async deleteComment(postId: string, commentId: string): Promise<void> {
    await api.delete(`/posts/${postId}/comments/${commentId}`);
  }
}

export default new PostService(); 