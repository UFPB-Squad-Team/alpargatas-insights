import { municipalityRepository } from '../repositories/municipalityRepository';

type ListParams = {
  page?: number;
  limit?: number;
};

const execute = async ({ page, limit }: ListParams = {}) => {
  return municipalityRepository.list(page, limit);
};

export const listMunicipalitiesUseCase = {
  execute,
};
