import { ISchoolRepository } from '../../../../domain/repositories/schoolRepository';
import { TopDeficienciesReturnDTO } from './TopDeficienciesReturnDTO';

export class TopDeficienciesUseCase {
  private readonly HIGH_RISK_THRESHOLD = 0.75;

  constructor(private schoolRepository: ISchoolRepository) {}

  async execute(): Promise<TopDeficienciesReturnDTO> {
    const schools = await this.schoolRepository.findAll();

    const deficienciesCount: Record<string, number> = {};

    const schoolsWithHighInfraestructureRisk = schools.filter(
      (school) => school.scoreRisco >= this.HIGH_RISK_THRESHOLD,
    );

    schoolsWithHighInfraestructureRisk.forEach((school) => {
      Object.entries(school.infraestrutura).forEach(([item, available]) => {
        if (available === false) {
          const formattedField =
            'Falta de' +
            ' ' +
            item.charAt(0).toLocaleUpperCase() +
            item.slice(1).toLowerCase();

          deficienciesCount[formattedField] =
            (deficienciesCount[formattedField] || 0) + 1;
        }
      });
    });

    const topDeficiencies = Object.entries(deficienciesCount)
      .map(([deficit, schools]) => ({ deficit, schools }))
      .sort((a, b) => b.schools - a.schools);

    return {
      topDeficiencies,
    };
  }
}
