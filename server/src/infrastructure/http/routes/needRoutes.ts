import { Router } from 'express';

import * as needController from '../controller/NeedController/index';

const needRoutes = Router();

needRoutes.post(
  '/api/v1/needs',
  needController.createNeedController.create.bind(
    needController.createNeedController,
  ),
);

export { needRoutes };
