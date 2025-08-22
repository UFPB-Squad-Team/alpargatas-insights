import { MunicipalityRiskFromApi } from '@/domain/entities/Municipality/Municipality';
import { School, SchoolFromApi } from '@/domain/entities/School/SchoolProps';

export type HighRiskSchoolsApiResponse = {
  schoolsWithHighInfraestructureRisk: SchoolFromApi[];
};

export type HighRiskSchool = School;

export type TopMunicipalitiesApiResponse = {
  municipalitiesWithMostSchoolsInHighRisk: MunicipalityRiskFromApi[];
};