import { IFilterState } from '@/ui/context/FiltersContext';
import { dashboardRepository } from '../../repositories/dashboardRepository';

export const getTopMunicipalitiesByRiskUseCase = {
  async execute(filters?: IFilterState) {
    return dashboardRepository.getTopMunicipalitiesByRisk(filters);
  },
};
