import { model, Schema } from 'mongoose';
import { IFeedback } from '../../../domain/entities/Feedback';
import { FeedbackStatus } from '../../../domain/enums/Feedback/enumFeedbackStatus';
import { FeedbackType } from '../../../domain/enums/Feedback/enumFeedbackType';

/**
 * @description Mongoose schema and model for Feedback.
 */
const feedbackSchema = new Schema<IFeedback>(
  {
    message: { type: String, required: true },
    type: { type: String, enum: Object.values(FeedbackType), required: true },
    page: { type: String },
    status: {
      type: String,
      enum: Object.values(FeedbackStatus),
      default: FeedbackStatus.NEW,
    },
  },
  { timestamps: true },
);

export const FeedbackModel = model<IFeedback>('Feedback', feedbackSchema);
