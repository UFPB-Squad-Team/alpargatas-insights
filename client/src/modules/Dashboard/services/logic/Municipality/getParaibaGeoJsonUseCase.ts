import { dashboardRepository } from '../../repositories/dashboardRepository';

/**
 * @description Use case to fetch the geographic data (GeoJSON) of Paraíba.
 */
export const getParaibaGeoJsonUseCase = {
  async execute() {
    return dashboardRepository.getParaibaGeoJson();
  },
};
