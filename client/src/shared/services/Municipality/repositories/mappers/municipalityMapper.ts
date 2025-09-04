import {
  MunicipalityDetails,
  MunicipalityDetailsFromApi,
  MunicipalityForFilter,
  MunicipalityForFilterFromApi,
  MunicipalityRisk,
  MunicipalityRiskCount,
  MunicipalityRiskCountFromApi,
  MunicipalityRiskFromApi,
} from '@/domain/entities/Municipality/Municipality';

/**
 * @description Maps a municipality's risk data from the API to our domain model.
 */
export const mapMunicipalityRiskFromApiToDomain = (
  apiMunicipality: MunicipalityRiskFromApi,
): MunicipalityRisk => {
  return {
    nome: apiMunicipality.nome,
    riscoMedio: apiMunicipality.riscoMedio,
  };
};

/**
 * @description Maps a municipality's data from the API to our domain model for the filter.
 */
export const mapMunicipalityForFilterFromApiToDomain = (
  apiMunicipality: MunicipalityForFilterFromApi,
): MunicipalityForFilter => {
  return {
    codigoIbge: apiMunicipality.id.toString(),
    nome: apiMunicipality.nome,
  };
};

/**
 * @description Maps a municipality's risk count data from the API to our domain model.
 */
export const mapMunicipalityRiskCountFromApiToDomain = (
  apiMunicipality: MunicipalityRiskCountFromApi,
): MunicipalityRiskCount => {
  return {
    codigoIbge: apiMunicipality.idIbge.toString(),
    nome: apiMunicipality.name,
    escolasEmAltoRisco: apiMunicipality.schoolCount,
  };
};

/**
 * @description Maps the details data of a municipality from the API to our domain model.
 */
export const mapMunicipalityDetailsFromApiToDomain = (
  apiMunicipality: MunicipalityDetailsFromApi,
): MunicipalityDetails => {
  return {
    codigoIbge: apiMunicipality.codigoIbge,
    nome: apiMunicipality.nome,
    uf: apiMunicipality.uf,
    totalEscolas: apiMunicipality.totalEscolas,
    riscoMedio: apiMunicipality.riscoMedio,
  };
};