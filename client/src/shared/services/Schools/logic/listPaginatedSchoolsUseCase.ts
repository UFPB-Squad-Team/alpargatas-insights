import { schoolRepository } from '@/shared/services/Schools/repositories/schoolRepository';
import { IFilterState } from '@/ui/context/FiltersContext';

type ListParams = IFilterState & {
  page?: number;
  limit?: number;
  searchTerm?: string;
};

const execute = (params: ListParams) => {
  return schoolRepository.listOrSearch(params);
};

export const listSchoolsUseCase = {
  execute,
};
