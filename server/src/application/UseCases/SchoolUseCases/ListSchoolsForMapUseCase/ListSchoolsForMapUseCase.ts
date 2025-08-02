import { ISchoolRepository } from '../../../../domain/repositories/schoolRepository';

export class ListSchoolsForMapUseCase {
  constructor(private schoolRepository: ISchoolRepository) {}

  async execute() {
    const schoolMap = await this.schoolRepository.findAllForMap();

    return schoolMap || [];
  }
}
