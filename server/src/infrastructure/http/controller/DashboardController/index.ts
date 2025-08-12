import { GetDashboardKPIsUseCase } from "../../../../application/UseCases/DashboardUseCases/GetDashboardKPIsUseCase/GetDashboardKPIsUseCase";
import { ListSchoolsForMapUseCase } from "../../../../application/UseCases/SchoolUseCases/ListSchoolsForMapUseCase/ListSchoolsForMapUseCase";
import { MoongoseMunicipalityRepository } from "../../../database/repository/moongoseMunicipalityRepository";
import { MoongoseSchoolRepository } from "../../../database/repository/moongoseSchoolRepository";
import { ListSchoolsForMapController } from "./ListSchoolsForMapController/ListSchoolsForMapController";
import { GetDashboardKPIsController } from "./GetDashboardKPIsController/GetDashboardKPIsController";
import { HighRiskSchoolUseCase } from "../../../../application/UseCases/DashboardUseCases/HighRiskSchoolListUseCase/HighRiskSchoolUseCase";
import { HighRiskSchoolController } from "./HighRiskSchoolListController/HighRiskSchoolController";
import { TopMunicipalitiesAverageRiskUseCase } from "../../../../application/UseCases/DashboardUseCases/TopMunicipalitiesAverageRiskUseCase/TopMunicipalitiesAverageRiskUseCase";
import { TopMunicipalitiesAverageRiskController } from "./TopMunicipalitiesAverageRiskController/TopMunicipalitiesAverageRiskController";

const municipalityRepository = new MoongoseMunicipalityRepository()

const schoolRepository = new MoongoseSchoolRepository()

const getDashboardKPIsUseCase = new GetDashboardKPIsUseCase(schoolRepository,municipalityRepository)

const listSchoolsForMapUseCase = new ListSchoolsForMapUseCase(schoolRepository);

const highRiskSchoolsUseCase = new HighRiskSchoolUseCase(schoolRepository)

const topMunicipalitiesAverageRiskUseCase = new TopMunicipalitiesAverageRiskUseCase(schoolRepository, municipalityRepository)

export const getDashboardKPIsController = new GetDashboardKPIsController(getDashboardKPIsUseCase)

export const listSchoolsForMapController = new ListSchoolsForMapController(
  listSchoolsForMapUseCase,
);

export const highRiskSchoolsController = new HighRiskSchoolController(highRiskSchoolsUseCase)

export const topMunicipalitiesAverageRiskController = new TopMunicipalitiesAverageRiskController(topMunicipalitiesAverageRiskUseCase)