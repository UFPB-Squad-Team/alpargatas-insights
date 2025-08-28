export interface MunicipalitiesByRiskCountReturnDTO {
  schoolsWithHighRiskPerMunicipality: {
    idIbge: string;
    name: string;
    schoolCount: number;
  }[];
}
