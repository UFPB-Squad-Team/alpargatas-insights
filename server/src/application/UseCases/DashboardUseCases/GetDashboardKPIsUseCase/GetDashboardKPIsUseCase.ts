import { IMunicipalityRepository } from '../../../../domain/repositories/municipalityRepository';
import { ISchoolRepository } from '../../../../domain/repositories/schoolRepository';
import { GetDashboardKPIsDTO } from './GetDashboardKPIsDTO';

export class GetDashboardKPIsUseCase {
  constructor(
    private schoolRepository: ISchoolRepository,
    private municipalityRepository: IMunicipalityRepository,
  ) {}

  async execute(): Promise<GetDashboardKPIsDTO> {
    const schools = await this.schoolRepository.findAll();

    const municipalities = await this.municipalityRepository.findAll();

    const HIGH_RISK_THRESHOLD: number = 0.75

    const theHighMunicipalitiesRisk = new Map<string, number>();

    let lackCountMax: number = 0;

    let lackName: string = 'No lacks identify';

    const schoolsWithHighInfraestructureRisk = schools
      .filter((school) => school.scoreRisco >= HIGH_RISK_THRESHOLD)
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

    schoolsWithHighInfraestructureRisk.forEach((schools) => {
      const count = theHighMunicipalitiesRisk.get(schools.municipioIdIbge) || 0;

      theHighMunicipalitiesRisk.set(schools.municipioIdIbge, count + 1);
    });

    const municipalitiesWithMostSchoolsInHighRisk = municipalities.filter(
      (municipality) => {
        const count = theHighMunicipalitiesRisk.get(municipality.id) || 0;

        return count >= 5;
      },
    );

    const countDocuments = schools.length;

    const mostInfraestructureMistake = new Map<string, number>();

    schools.forEach((school) => {
      Object.entries(school.infraestrutura).forEach(([item, available]) => {
        if (!available) {
          mostInfraestructureMistake.set(
            item,
            (mostInfraestructureMistake.get(item) || 0) + 1,
          );
        }
      });
    });

    mostInfraestructureMistake.forEach((count, item) => {
      if (count > lackCountMax) {
        lackCountMax = count;
        lackName = item;
      }
    });

    return {
      schools: countDocuments,
      schoolsWithHighInfraestructureRisk,
      municipalitiesWithMostSchoolsInHighRisk,
      lackName,
    };
  }
}
