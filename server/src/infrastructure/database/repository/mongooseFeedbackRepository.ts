import { IFeedback } from '../../../domain/entities/Feedback';
import { IFeedbackRepository } from '../../../domain/repositories/feedbackRepository';
import { FeedbackModel } from '../../configs/models/mongooseFeedbackModel';

/**
 * @implements IFeedbackRepository
 * @description Mongoose implementation of the Feedback repository.
 *
 * @method save - Saves a feedback entry to the database.
 */
export class MongooseFeedbackRepository implements IFeedbackRepository {
  async save(feedback: IFeedback): Promise<IFeedback> {
    const newFeedback = await FeedbackModel.create(feedback);
    return newFeedback.toObject();
  }
}
