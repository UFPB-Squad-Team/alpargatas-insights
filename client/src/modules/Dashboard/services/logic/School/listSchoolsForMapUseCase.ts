import { schoolRepository } from '@/shared/services/Schools/repositories/schoolRepository.ts';

/**
 * @description Use case to fetch the optimized list of schools for the map.
 * It serves as an abstraction layer between the component and the repository.
 */
export const listSchoolsForMapUseCase = {
  async execute() {
    return schoolRepository.listForMap();
  },
};
