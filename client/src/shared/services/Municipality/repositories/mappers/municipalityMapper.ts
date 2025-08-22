import {
  MunicipalityRisk,
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
