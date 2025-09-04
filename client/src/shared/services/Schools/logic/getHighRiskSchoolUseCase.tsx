import { dashboardRepository } from '@/modules/Dashboard/services/repositories/dashboardRepository';
import { IFilterState } from '@/ui/context/FiltersContext';

export const getHighRiskSchoolsUseCase = {
  async execute(filters: IFilterState) {
    return dashboardRepository.getHighRiskSchools(filters);
  },
};
