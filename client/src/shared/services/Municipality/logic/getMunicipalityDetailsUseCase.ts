import { municipalityRepository } from '../repositories/municipalityRepository';

const execute = (id: string) => {
  if (!id) {
    throw new Error('ID do município é obrigatório.');
  }
  return municipalityRepository.findById(id);
};

export const getMunicipalityDetailsUseCase = {
  execute,
};
