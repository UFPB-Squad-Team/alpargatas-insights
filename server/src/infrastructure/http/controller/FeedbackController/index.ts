import { CreateFeedbackUseCase } from '../../../../application/UseCases/Feedback/CreateFeedbackUseCase/CreateFeedbackUseCase';
import { MongooseFeedbackRepository } from '../../../database/repository/mongooseFeedbackRepository';
import { CreateFeedbackController } from './CreateFeedbackController/CreateFeedbackController';

const feedbackRepository = new MongooseFeedbackRepository();

const createFeedbackUseCase = new CreateFeedbackUseCase(feedbackRepository);

export const createFeedbackController = new CreateFeedbackController(
  createFeedbackUseCase,
);
