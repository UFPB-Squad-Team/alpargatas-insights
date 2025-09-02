import { School } from '../../../../domain/entities/school';
import { ISchoolRepository } from '../../../../domain/repositories/schoolRepository';
import { TopDeficienciesReturnDTO } from './TopDeficienciesReturnDTO';

export class TopDeficienciesUseCase {
  private readonly HIGH_RISK_THRESHOLD = 0.75;

  constructor(private schoolRepository: ISchoolRepository) {}

  async execute(filters?: Partial<School>): Promise<TopDeficienciesReturnDTO> {
    const deficienciesCount: Record<string, number> = {};

    const schoolsWithHighInfraestructureRisk =
      await this.schoolRepository.findWithFilters(
        this.HIGH_RISK_THRESHOLD,
        filters,
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
