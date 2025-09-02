import { schoolRepository } from '@/shared/services/Schools/repositories/schoolRepository';

const execute = (id: string) => {
  if (!id) {
    throw new Error('ID da escola é obrigatório.');
  }
  return schoolRepository.findById(id);
};

export const getSchoolDetailsUseCase = {
  execute,
};
