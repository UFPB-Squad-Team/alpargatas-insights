import { ISchoolRepository } from '../../../../domain/repositories/schoolRepository';
import { GetSchoolsByDependenciaAdministrativaDTO } from './GetSchoolsByDependenciaAdministrativaDTO';

export class GetSchoolsByDependenciaAdministrativa {
  constructor(private schoolRepository: ISchoolRepository) {}

  async execute({
    dependenciaAdm,
  }: GetSchoolsByDependenciaAdministrativaDTO) {
    const schoolsByDependenciaAdministrativa =
      await this.schoolRepository.findByDepAdm(dependenciaAdm);

    return schoolsByDependenciaAdministrativa || [];
  }
}
