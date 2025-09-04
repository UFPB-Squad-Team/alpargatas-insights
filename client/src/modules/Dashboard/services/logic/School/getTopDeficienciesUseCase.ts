import { FiltersOptions } from '@/shared/services/Schools/repositories/schoolRepository';
import { dashboardRepository } from '../../repositories/dashboardRepository';

export const getTopDeficienciesUseCase = {
  async execute(filters?: FiltersOptions) {
    return dashboardRepository.getTopDeficiencies(filters);
  },
};
