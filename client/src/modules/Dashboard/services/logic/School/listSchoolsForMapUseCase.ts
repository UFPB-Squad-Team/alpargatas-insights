import {
  FiltersOptions,
  schoolRepository,
} from '@/shared/services/Schools/repositories/schoolRepository.ts';

export const listSchoolsForMapUseCase = {
  async execute(filters: FiltersOptions) {
    return schoolRepository.listForMap(filters);
  },
};
