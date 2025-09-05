import { FiltersOptions } from '@/shared/services/Schools/repositories/schoolRepository';
import { dashboardRepository } from '../repositories/dashboardRepository';

export const getDashboardKPIsUseCase = {
  async execute(filters: FiltersOptions) {
    return dashboardRepository.getKpis(filters);
  },
};
