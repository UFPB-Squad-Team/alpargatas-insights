import { municipalityRepository } from '../repositories/municipalityRepository';

export const listMunicipalitiesUseCase = {
  async execute() {
    return municipalityRepository.listForFilter();
  },
};
