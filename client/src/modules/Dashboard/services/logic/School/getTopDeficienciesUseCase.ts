import { dashboardRepository } from '../../repositories/dashboardRepository';

export const getTopDeficienciesUseCase = {
  async execute() {
    return dashboardRepository.getTopDeficiencies();
  },
};
