import { dashboardRepository } from '../../repositories/dashboardRepository';

export const getTopMunicipalitiesByRiskUseCase = {
  async execute() {
    return dashboardRepository.getTopMunicipalitiesByRisk();
  },
};
