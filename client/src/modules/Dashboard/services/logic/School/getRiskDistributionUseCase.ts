import { dashboardRepository } from '../../repositories/dashboardRepository';

export const getRiskDistributionUseCase = {
  async execute() {
    return dashboardRepository.getRiskDistribution();
  },
};
