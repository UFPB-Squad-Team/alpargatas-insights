import { dashboardRepository } from '../repositories/dashboardRepository';

export const getDashboardKPIsUseCase = {
  async execute() {
    return dashboardRepository.getKpis();
  },
};
