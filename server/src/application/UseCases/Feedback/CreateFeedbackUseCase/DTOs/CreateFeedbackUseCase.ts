import { FeedbackStatus } from '../../../../../domain/enums/Feedback/enumFeedbackStatus';
import { FeedbackType } from '../../../../../domain/enums/Feedback/enumFeedbackType';

/**
 * @description DTO for creating feedback.
 */
export interface ICreateFeedbackInputDTO {
  message: string;
  type: FeedbackType;
  page?: string;
}

/**
 * @description DTO for the output after creating feedback.
 */
export interface ICreateFeedbackOutputDTO {
  id: string;
  message: string;
  type: FeedbackType;
  status: FeedbackStatus;
  createdAt: Date;
}
