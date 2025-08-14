import { GetMunicipalityStatisticsUseCase } from '../../../../application/UseCases/MunicipalityUseCases/GetMunicipalityStatisticsUseCase/GetMunicipalityStatisticsUseCase';
import { GetMunicipalityWithIbgeCodeUseCase } from '../../../../application/UseCases/MunicipalityUseCases/GetMunicipalityWithIbgeCodeUseCase/GetMunicipalityWithIbgeCodeUseCase';
import { ListMunicipalitiesUseCase } from '../../../../application/UseCases/MunicipalityUseCases/ListMunicipalitiesUseCase/ListMunicipalitiesUseCase';
import { MoongoseMunicipalityRepository } from '../../../database/repository/moongoseMunicipalityRepository';
import { MoongoseSchoolRepository } from '../../../database/repository/moongoseSchoolRepository';
import { GetMunicipalityStatisticsController } from './GetMunicipalityStatisticsController/GetMunicipalityStatisticsController';
import { GetMunicipalityWithIbgeCodeController } from './GetMunicipalityWithIbgeCodeController/GetMunicipalityWithIbgeCodeController';
import { ListMunicipalitiesController } from './ListMunicipalitiesController/ListMunicipalitiesController';

const schoolRepository = new MoongoseSchoolRepository();

const municipalityRepository = new MoongoseMunicipalityRepository();

const getMunicipalityStatisticsUseCase = new GetMunicipalityStatisticsUseCase(
  schoolRepository,
);

const getMunicpalityWithIbgeCodeUseCase =
  new GetMunicipalityWithIbgeCodeUseCase(municipalityRepository);

const listMunicpalitiesUseCase = new ListMunicipalitiesUseCase(
  municipalityRepository,
);

export const getMunicipalityStatisticsController =
  new GetMunicipalityStatisticsController(getMunicipalityStatisticsUseCase);

export const getMunicipalityWithIbgeCodeController =
  new GetMunicipalityWithIbgeCodeController(getMunicpalityWithIbgeCodeUseCase);

export const listMunicipalitiesController = new ListMunicipalitiesController(
  listMunicpalitiesUseCase,
);
