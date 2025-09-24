/**
 * @description Contract that represents the object of a municipality as it comes from the API.
 * Based on the response of the endpoint /api/v1/dashboard/municipalities-by-risk-count.
 */
export type MunicipalityRiskFromApi = {
  nome: string;
  riscoMedio: number;
  codigoIbge: string;
};

/**
 * @description Our internal domain model for a municipality in the risk list.
 * It is the type that our final component will consume.
 */
export type MunicipalityRisk = {
  nome: string;
  riscoMedio: number;
  codigoIbge: string;
};

/**
 * @description Contract that represents a municipality in the filter list as it comes from the API.
 */
export type MunicipalityForFilterFromApi = {
  id: number;
  nome: string;
};

/**
 * @description Our internal domain model for the municipality filter.
 */
export type MunicipalityForFilter = {
  codigoIbge: string;
  nome: string;
};

/**
 * @description Contract that represents the object of a municipality as it comes from the API
 * in the endpoint for counting schools at risk.
 */
export type MunicipalityRiskCountFromApi = {
  idIbge: string;
  name: string;
  schoolCount: number;
};

/**
 * @description Our internal domain model for the risk count by municipality.
 * It is the type that our choropleth map will consume.
 */
export type MunicipalityRiskCount = {
  codigoIbge: string;
  nome: string;
  escolasEmAltoRisco: number;
};

/**
 * @description Contract that represents the API response for the details of a municipality.
 */
export type MunicipalityDetailsFromApi = {
  id: string;
  codigoIbge: string;
  nome: string;
  uf: string;
  riscoMedio: number;
  totalEscolas: number;
  totalEscolasUrbanas: number;
  totalEscolasRurais: number;
  totalEscolasMunicipais: number;
  totalEscolasEstaduais: number;
  totalEscolasFederais: number;
  totalEscolasEmAltoRisco: number;
  totalProjetosDoInstituto: number;
  totalBeneficiadosDoInstituto: number;
};

/**
 * @description Our internal and clean domain model for municipality details.
 */
export type MunicipalityDetails = {
  codigoIbge: string;
  nome: string;
  uf: string;
  riscoMedio: number;
  totalEscolas: number;
  totalEscolasUrbanas: number;
  totalEscolasRurais: number;
  totalEscolasMunicipais: number;
  totalEscolasEstaduais: number;
  totalEscolasFederais: number;
  totalEscolasEmAltoRisco: number;
  totalProjetosDoInstituto: number;
  totalBeneficiadosDoInstituto: number;
};
