import { dashboardRepository } from '../../repositories/dashboardRepository';

/**
 * @description Use case to fetch the count of schools at high risk by municipality.
 */
export const getMunicipalitiesByRiskCountUseCase = {
  async execute() {
    return dashboardRepository.getMunicipalitiesByRiskCount();
  },
};
