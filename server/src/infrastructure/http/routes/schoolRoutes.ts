import { Router } from 'express';

import * as schoolControllers from '../controller/SchoolControllers/index';

const schoolRoutes = Router();
schoolRoutes.get(
  '/api/v1/schools/all',
  schoolControllers.getAllSchoolsController.getAll.bind(
    schoolControllers.getAllSchoolsController,
  ),
);

schoolRoutes.get(
  '/api/v1/schools',
  schoolControllers.searchSchoolsController.searchSchools.bind(
    schoolControllers.searchSchoolsController,
  ),
);

schoolRoutes.get(
  '/api/v1/schools/:id',
  schoolControllers.getSchoolDetailsController.getDetails.bind(
    schoolControllers.getSchoolDetailsController,
  ),
);


schoolRoutes.get(
  '/api/v1/schools/details/:dependenciaAdm',
  schoolControllers.getSchoolsByDependenciaAdministrativaController.getByDependenciaAdm.bind(
    schoolControllers.getSchoolsByDependenciaAdministrativaController,
  ),
);

export { schoolRoutes };
