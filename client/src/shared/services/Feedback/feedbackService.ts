import { FeedbackType } from '@/domain/entities/Feedback/FeedbackTypes';
import { apiClient } from '@/shared/lib/axios';

interface CreateFeedbackPayload {
  message: string;
  type: FeedbackType;
  page: string;
}

export const feedbackService = {
  async create(payload: CreateFeedbackPayload): Promise<void> {
    await apiClient.post('/api/v1/feedback', payload);
  },
};
