import api from './api';

/**
 * Answer Service - Handles all API calls related to answers
 */
class AnswerService {
  /**
   * Create a new answer for a question
   * @param content The content of the answer
   * @param questionId The ID of the question being answered
   * @returns The created answer object
   */
  async createAnswer(content: string, questionId: string) {
    const response = await api.post('/answers', { content, questionId });
    return response.data;
  }

  /**
   * Get all answers for a specific question
   * @param questionId The ID of the question
   * @returns Array of answers for the question
   */
  async getAnswersForQuestion(questionId: string) {
    const response = await api.get(`/answers/question/${questionId}`);
    return response.data;
  }

  /**
   * Upvote an answer
   * @param answerId The ID of the answer to upvote
   * @returns The updated answer object
   */
  async upvoteAnswer(answerId: string) {
    const response = await api.post(`/answers/${answerId}/upvote`);
    return response.data;
  }

  /**
   * Downvote an answer
   * @param answerId The ID of the answer to downvote
   * @returns The updated answer object
   */
  async downvoteAnswer(answerId: string) {
    const response = await api.post(`/answers/${answerId}/downvote`);
    return response.data;
  }

  /**
   * Accept an answer as the correct answer for a question
   * @param answerId The ID of the answer to accept
   * @returns The updated answer object
   */
  async acceptAnswer(answerId: string) {
    const response = await api.post(`/answers/${answerId}/accept`);
    return response.data;
  }
}

export default new AnswerService(); 