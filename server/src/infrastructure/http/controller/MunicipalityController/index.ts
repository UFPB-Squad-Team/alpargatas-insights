import { GetAllMunicipalitiesWithHighRiskSchoolUseCase } from '../../../../application/UseCases/MunicipalityUseCases/GetAllMunicipalitiesWithHighRiskSchool/GetAllMunicipalitiesWithHighRiskSchool/GetAllMunicipalitiesWithHighRiskSchool';
import { GetMunicipalityStatisticsUseCase } from '../../../../application/UseCases/MunicipalityUseCases/GetMunicipalityStatisticsUseCase/GetMunicipalityStatisticsUseCase';
import { GetMunicipalityWithIbgeCodeUseCase } from '../../../../application/UseCases/MunicipalityUseCases/GetMunicipalityWithIbgeCodeUseCase/GetMunicipalityWithIbgeCodeUseCase';
import { ListMunicipalitiesUseCase } from '../../../../application/UseCases/MunicipalityUseCases/ListMunicipalitiesUseCase/ListMunicipalitiesUseCase';
import { MoongoseMunicipalityRepository } from '../../../database/repository/moongoseMunicipalityRepository';
import { MoongoseSchoolRepository } from '../../../database/repository/moongoseSchoolRepository';
import { GetAllMunicipalitiesWithHighRiskSchoolController } from './GetAllMunicipalitiesWithHighRiskSchool/GetAllMunicipalitiesWithHighRiskSchool';
import { GetMunicipalityStatisticsController } from './GetMunicipalityStatisticsController/GetMunicipalityStatisticsController';
import { GetMunicipalityWithIbgeCodeController } from './GetMunicipalityWithIbgeCodeController/GetMunicipalityWithIbgeCodeController';
import { ListMunicipalitiesController } from './ListMunicipalitiesController/ListMunicipalitiesController';

const schoolRepository = new MoongoseSchoolRepository();

const municipalityRepository = new MoongoseMunicipalityRepository();

const getMunicipalityStatisticsUseCase = new GetMunicipalityStatisticsUseCase(
  schoolRepository,
);

const getMunicpalityWithIbgeCodeUseCase =
  new GetMunicipalityWithIbgeCodeUseCase(
    municipalityRepository,
    schoolRepository,
  );

const listMunicpalitiesUseCase = new ListMunicipalitiesUseCase(
  municipalityRepository,
);

const getAllMunicipalitiesWithHighRiskSchoolUseCase =
  new GetAllMunicipalitiesWithHighRiskSchoolUseCase(schoolRepository);

export const getMunicipalityStatisticsController =
  new GetMunicipalityStatisticsController(getMunicipalityStatisticsUseCase);

export const getMunicipalityWithIbgeCodeController =
  new GetMunicipalityWithIbgeCodeController(getMunicpalityWithIbgeCodeUseCase);

export const listMunicipalitiesController = new ListMunicipalitiesController(
  listMunicpalitiesUseCase,
);

export const getAllMunicipalitiesWithHighRiskSchoolController =
  new GetAllMunicipalitiesWithHighRiskSchoolController(
    getAllMunicipalitiesWithHighRiskSchoolUseCase,
  );
