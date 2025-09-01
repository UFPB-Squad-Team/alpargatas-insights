import { School } from '@/domain/entities/School/SchoolProps';
import { schoolRepository } from '@/shared/services/Schools/repositories/schoolRepository';

const execute = (): Promise<School[]> => {
  return schoolRepository.listAll();
};

export const listAllSchoolsUseCase = {
  execute,
};
