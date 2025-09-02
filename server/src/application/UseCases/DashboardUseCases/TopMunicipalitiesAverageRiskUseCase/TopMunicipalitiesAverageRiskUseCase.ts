import { School } from '../../../../domain/entities/school';
import { IMunicipalityRepository } from '../../../../domain/repositories/municipalityRepository';
import { ISchoolRepository } from '../../../../domain/repositories/schoolRepository';

export class TopMunicipalitiesAverageRiskUseCase {
  private readonly HIGH_RISK_THRESHOLD: number = 0.75;
  constructor(
    private schoolRepository: ISchoolRepository,
    private municipalityRepository: IMunicipalityRepository,
  ) {}

  async execute(filters?: Partial<School>) {
    const schools = await this.schoolRepository.findWithFilters(
      this.HIGH_RISK_THRESHOLD,
      filters,
    );

    const municipalities = await this.municipalityRepository.findAll();

    const schoolsWithHighInfraestructureRisk = schools
      .filter(
        (school) =>
          school.scoreRiscoContextualizado >= this.HIGH_RISK_THRESHOLD,
      )
      .map((school) => ({
        id: school.id,
        escolaIdInep: school.escolaIdInep,
        escolaNome: school.escolaNome,
        municipioNome: school.municipioNome,
        municipioIdIbge: school.municipioIdIbge,
        dependenciaAdm: school.dependenciaAdm,
        estadoSigla: school.estadoSigla,
        scoreRisco: school.scoreRisco,
        infraestrutura: school.infraestrutura,
        localizacao: school.localizacao,
      }));

    const theHighMunicipalitiesRisk = new Map<string, number>();

    schoolsWithHighInfraestructureRisk.forEach((schools) => {
      const count = theHighMunicipalitiesRisk.get(schools.municipioIdIbge) || 0;

      theHighMunicipalitiesRisk.set(schools.municipioIdIbge, count + 1);
    });

    const municipalitiesWithMostSchoolsInHighRisk = municipalities
      .filter((municipality) => {
        const count = theHighMunicipalitiesRisk.get(municipality.id) || 0;

        return count >= 5;
      })
      .sort((a, b) => b.riscoMedio - a.riscoMedio)
      .slice(0, 5);

    return {
      municipalitiesWithMostSchoolsInHighRisk,
    };
  }
}
