import { School } from '../../../../domain/entities/school';
import { ISchoolRepository } from '../../../../domain/repositories/schoolRepository';

export class ListSchoolsForMapUseCase {
  constructor(private schoolRepository: ISchoolRepository) {}

  async execute(filters?: Partial<School>) {
    const schoolMap = await this.schoolRepository.findAllForMap(filters);

    return schoolMap || [];
  }
}
