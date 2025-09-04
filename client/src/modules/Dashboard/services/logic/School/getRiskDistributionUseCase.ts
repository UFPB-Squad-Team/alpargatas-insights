import { FiltersOptions } from '@/shared/services/Schools/repositories/schoolRepository';
import { dashboardRepository } from '../../repositories/dashboardRepository';

export const getRiskDistributionUseCase = {
  async execute(filters: FiltersOptions) {
    return dashboardRepository.getRiskDistribution(filters);
  },
};
