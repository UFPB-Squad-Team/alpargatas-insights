import { IFilterState } from '@/ui/context/FiltersContext';
import { dashboardRepository } from '../../repositories/dashboardRepository';

export const getAllMunicipalitiesForMapUseCase = {
  async execute(filters?: IFilterState) {
    return dashboardRepository.getAllMunicipalitiesForMap(filters);
  },
};
