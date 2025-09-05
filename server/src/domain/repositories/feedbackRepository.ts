import { IFeedback } from '../entities/Feedback';

/**
 * @description Interface for the Feedback repository.
 */
export interface IFeedbackRepository {
  save(feedback: IFeedback): Promise<IFeedback>;
  // In the future we can add methods like findById, updateStatus, etc.
}
