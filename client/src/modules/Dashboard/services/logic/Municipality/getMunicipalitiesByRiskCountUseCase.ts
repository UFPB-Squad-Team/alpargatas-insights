import { FiltersOptions } from '@/shared/services/Schools/repositories/schoolRepository';
import { dashboardRepository } from '../../repositories/dashboardRepository';

/**
 * @description Use case to fetch the count of schools at high risk by municipality.
 */
export const getMunicipalitiesByRiskCountUseCase = {
  async execute(filters?: FiltersOptions) {
    return dashboardRepository.getMunicipalitiesByRiskCount(filters);
  },
};
