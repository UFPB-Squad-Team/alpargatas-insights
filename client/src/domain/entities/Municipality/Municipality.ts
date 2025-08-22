/**
 * @description Contract that represents the object of a municipality as it comes from the API.
 * Based on the response of the endpoint /api/v1/dashboard/municipalities-by-risk-count.
 */
export type MunicipalityRiskFromApi = {
  nome: string;
  riscoMedio: number;
};

/**
 * @description Our internal domain model for a municipality in the risk list.
 * It is the type that our final component will consume.
 */
export type MunicipalityRisk = {
  nome: string;
  riscoMedio: number;
};
