import { GetDashboardKPIsUseCase } from '../../../../application/UseCases/DashboardUseCases/GetDashboardKPIsUseCase/GetDashboardKPIsUseCase';
import { ListSchoolsForMapUseCase } from '../../../../application/UseCases/SchoolUseCases/ListSchoolsForMapUseCase/ListSchoolsForMapUseCase';
import { MoongoseMunicipalityRepository } from '../../../database/repository/moongoseMunicipalityRepository';
import { MoongoseSchoolRepository } from '../../../database/repository/moongoseSchoolRepository';
import { ListSchoolsForMapController } from './ListSchoolsForMapController/ListSchoolsForMapController';
import { GetDashboardKPIsController } from './GetDashboardKPIsController/GetDashboardKPIsController';
import { HighRiskSchoolUseCase } from '../../../../application/UseCases/DashboardUseCases/HighRiskSchoolListUseCase/HighRiskSchoolUseCase';
import { HighRiskSchoolController } from './HighRiskSchoolListController/HighRiskSchoolController';
import { TopMunicipalitiesAverageRiskUseCase } from '../../../../application/UseCases/DashboardUseCases/TopMunicipalitiesAverageRiskUseCase/TopMunicipalitiesAverageRiskUseCase';
import { TopMunicipalitiesAverageRiskController } from './TopMunicipalitiesAverageRiskController/TopMunicipalitiesAverageRiskController';
import { RiskDistributionDashboardUseCase } from '../../../../application/UseCases/DashboardUseCases/RiskDistributionDashboardUseCase/RiskDistributionDashboardUseCase';
import { RiskDistributionDashboardController } from './RiskDistributionDashboardController/RiskDistributionDashboardController';
import { TopDeficienciesUseCase } from '../../../../application/UseCases/DashboardUseCases/TopDeficienciesUseCase/TopDeficienciesUseCase';
import { TopDeficienciesController } from './TopDeficienciesController/TopDeficienciesController';

const municipalityRepository = new MoongoseMunicipalityRepository();

const schoolRepository = new MoongoseSchoolRepository();

const getDashboardKPIsUseCase = new GetDashboardKPIsUseCase(
  schoolRepository,
  municipalityRepository,
);

const listSchoolsForMapUseCase = new ListSchoolsForMapUseCase(schoolRepository);

const highRiskSchoolsUseCase = new HighRiskSchoolUseCase(schoolRepository);

const topMunicipalitiesAverageRiskUseCase =
  new TopMunicipalitiesAverageRiskUseCase(
    schoolRepository,
    municipalityRepository,
  );

const riskDistributionDashboardUseCase = new RiskDistributionDashboardUseCase(
  schoolRepository,
);

const topDeficienciesUseCase = new TopDeficienciesUseCase(schoolRepository);

export const getDashboardKPIsController = new GetDashboardKPIsController(
  getDashboardKPIsUseCase,
);

export const listSchoolsForMapController = new ListSchoolsForMapController(
  listSchoolsForMapUseCase,
);

export const highRiskSchoolsController = new HighRiskSchoolController(
  highRiskSchoolsUseCase,
);

export const topMunicipalitiesAverageRiskController =
  new TopMunicipalitiesAverageRiskController(
    topMunicipalitiesAverageRiskUseCase,
  );

export const riskDistributionDashboardController =
  new RiskDistributionDashboardController(riskDistributionDashboardUseCase);

export const topDeficienciesController = new TopDeficienciesController(
  topDeficienciesUseCase,
);
