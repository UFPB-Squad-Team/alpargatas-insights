import { GetAllSchoolsUseCase } from '../../../../application/UseCases/SchoolUseCases/GetAllSchoolsUseCase/GetAllSchoolsUseCase';
import { GetSchoolDetailsUseCase } from '../../../../application/UseCases/SchoolUseCases/GetSchoolDetailsUseCase/GetSchoolDetailsUseCase';
import { GetSchoolsByDependenciaAdministrativa } from '../../../../application/UseCases/SchoolUseCases/GetSchoolsByDependenciaAdmnistrativaUseCase/GetSchoolsByDependenciaAdministrativaUseCase';
import { ListSchoolsForMapUseCase } from '../../../../application/UseCases/SchoolUseCases/ListSchoolsForMapUseCase/ListSchoolsForMapUseCase';
import { SearchSchoolsUseCase } from '../../../../application/UseCases/SchoolUseCases/SearchSchoolsUseCase/SearchSchoolsUseCase';
import { MoongoseSchoolRepository } from '../../../database/repository/moongoseSchoolRepository';
import { GetAllSchoolsController } from './GetAllSchoolsController/GetAllSchoolsController';
import { GetSchoolDetailsController } from './GetSchoolDetailsController/GetSchoolDetailsController';
import { GetSchoolsByDependenciaAdministrativaController } from './GetSchoolsByDependenciaAdministrativaController/GetSchoolsByDependenciaAdministrativaController';
import { ListSchoolsForMapController } from './ListSchoolsForMapController/ListSchoolsForMapController';
import { SearchSchoolsController } from './SearchSchoolsController/SearchSchoolsController';

const schoolRepository = new MoongoseSchoolRepository();

const getAllSchoolsUseCase = new GetAllSchoolsUseCase(schoolRepository);
const getSchoolDetailsUseCase = new GetSchoolDetailsUseCase(schoolRepository);
const getSchoolsByDependenciaAdministrativaUseCase =
  new GetSchoolsByDependenciaAdministrativa(schoolRepository);
const listSchoolsForMapUseCase = new ListSchoolsForMapUseCase(schoolRepository);
const searchSchoolsUseCase = new SearchSchoolsUseCase(schoolRepository);

export const getAllSchoolsController = new GetAllSchoolsController(
  getAllSchoolsUseCase,
);
export const getSchoolDetailsController = new GetSchoolDetailsController(
  getSchoolDetailsUseCase,
);
export const getSchoolsByDependenciaAdministrativaController =
  new GetSchoolsByDependenciaAdministrativaController(
    getSchoolsByDependenciaAdministrativaUseCase,
  );
export const listSchoolsForMapController = new ListSchoolsForMapController(
  listSchoolsForMapUseCase,
);
export const searchSchoolsController = new SearchSchoolsController(
  searchSchoolsUseCase,
);
