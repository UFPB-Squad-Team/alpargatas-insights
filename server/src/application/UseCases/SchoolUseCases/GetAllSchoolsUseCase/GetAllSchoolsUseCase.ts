import { ISchoolRepository } from '../../../../domain/repositories/schoolRepository';
import { GetAllSchoolsDTO } from './GetAllSchoolsDTO';

export class GetAllSchoolsUseCase {
  constructor(private schoolRepository: ISchoolRepository) {}

  async execute({ page, limit, filters, term }: GetAllSchoolsDTO) {
    return await this.schoolRepository.pagination(page, limit, filters, term);
  }
}
