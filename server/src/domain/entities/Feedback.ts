import { FeedbackStatus } from '../enums/Feedback/enumFeedbackStatus';
import { FeedbackType } from '../enums/Feedback/enumFeedbackType';

/**
 * @description Interface representing a feedback entry.
 */
export interface IFeedback {
  id?: string;
  message: string;
  type: FeedbackType;
  page?: string;
  status: FeedbackStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
