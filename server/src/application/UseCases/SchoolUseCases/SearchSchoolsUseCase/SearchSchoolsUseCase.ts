import { ISchoolRepository } from '../../../../domain/repositories/schoolRepository';
import { AppError } from '../../../../shared/utils/errors/appError';
import { SearchSchoolsDTO } from './SearchSchoolsDTO';

export class SearchSchoolsUseCase {
  constructor(private schoolRepository: ISchoolRepository) {}

  async execute({ term, page, limit }: SearchSchoolsDTO) {
    if (!term || typeof term !== 'string') {
      throw new AppError('Term is required');
    }

    if (page < 1 || limit < 1) {
      throw new AppError('Parameters invalid');
    }

    return await this.schoolRepository.findSearchByTerm(term, page, limit);
  }
}
