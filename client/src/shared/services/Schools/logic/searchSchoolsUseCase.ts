import { PaginatedResponse } from '@/domain/entities/PaginatedResponse';
import { schoolRepository } from '../repositories/schoolRepository';
import { School } from '@/domain/entities/SchoolProps';

export const searchSchoolsUseCase = {
  async execute(searchTerm: string): Promise<PaginatedResponse<School>> {
    const paginatedResult = await schoolRepository.search(searchTerm);

    paginatedResult.data.sort((a, b) => b.scoreDeRisco - a.scoreDeRisco);

    return paginatedResult;
  },
};
