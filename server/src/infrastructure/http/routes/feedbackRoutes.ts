import { Router } from 'express';

import * as feedbackController from '../controller/FeedbackController/index';

const feedbackRoutes = Router();

feedbackRoutes.post(
  '/api/v1/feedback',
  feedbackController.createFeedbackController.handle.bind(
    feedbackController.createFeedbackController,
  ),
);

export { feedbackRoutes };
