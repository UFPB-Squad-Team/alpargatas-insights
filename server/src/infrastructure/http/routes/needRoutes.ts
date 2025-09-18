import { Router } from 'express';

import * as needController from '../controller/NeedController/index';

const needRoutes = Router();

needRoutes.get(
  '/api/v1/list/needsApproved',
  needController.listNeedApprovedController.listApprovedNeeds.bind(
    needController.listNeedApprovedController,
  ),
);

needRoutes.get('/api/v1/needs/:id', needController.listNeedDetailsController.listDetails.bind(needController.listNeedDetailsController))

needRoutes.post(
  '/api/v1/needs',
  needController.createNeedController.create.bind(
    needController.createNeedController,
  ),
);

export { needRoutes };
