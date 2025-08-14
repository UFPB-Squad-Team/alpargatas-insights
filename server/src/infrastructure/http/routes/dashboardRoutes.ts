import { Router } from 'express';

import * as dashboardController from '../controller/DashboardController/index';

const dashboardRoutes = Router();

dashboardRoutes.get(
  '/api/v1/dashboard/kpis',
  dashboardController.getDashboardKPIsController.getKpis.bind(
    dashboardController.getDashboardKPIsController,
  ),
);

dashboardRoutes.get(
  '/api/v1/dashboard/high-risk-schools',
  dashboardController.highRiskSchoolsController.getRiskSchools.bind(
    dashboardController.highRiskSchoolsController,
  ),
);

dashboardRoutes.get(
  '/api/v1/dashboard/top-municipalities-by-risk',
  dashboardController.topMunicipalitiesAverageRiskController.getTopAverageRiskMunicipality.bind(
    dashboardController.topMunicipalitiesAverageRiskController,
  ),
);

dashboardRoutes.get(
  '/api/v1/dashboard/map-data',
  dashboardController.listSchoolsForMapController.listSchoolsForMap.bind(
    dashboardController.listSchoolsForMapController,
  ),
);

dashboardRoutes.get("/api/v1/dashboard/risk-distribution", dashboardController.riskDistributionDashboardController.getRiskDistribution.bind(dashboardController.riskDistributionDashboardController))

dashboardRoutes.get("/api/v1/dashboard/top-deficiencies", dashboardController.topDeficienciesController.getTopDeficienciesInSchools.bind(dashboardController.topDeficienciesController))

export { dashboardRoutes };
