import { municipalityRepository } from '../repositories/municipalityRepository';

type ListParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
};

const execute = async ({ page, limit, searchTerm }: ListParams = {}) => {
  return municipalityRepository.list(page, limit, searchTerm);
};

export const listMunicipalitiesUseCase = {
  execute,
};
