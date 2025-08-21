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

    const HIGH_RISK_THRESHOLD: number = 0.75;

    let lackCountMax: number = 0;

    let lackName: string = 'No lacks identify';

    const schoolsWithHighInfraestructureRisk = schools
      .filter(
        (school) => school.scoreRiscoContextualizado >= HIGH_RISK_THRESHOLD,
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
        municipioSomaProjetos: school.municipioSomaProjetos,
        municipioSomaBeneficiados: school.municipioSomaBeneficiados,
        municipioMediaIdeb2023: school.municipioMediaIdeb2023,
        riscoIdebMunicipio: school.riscoIdebMunicipio,
        scoreRiscoContextualizado: school.scoreRiscoContextualizado,
        infraestrutura: school.infraestrutura,
        localizacao: school.localizacao,
      }));

    const municipalityRiskStats = schools.reduce(
      (acc, school) => {
        if (!acc[school.municipioIdIbge]) {
          acc[school.municipioIdIbge] = {
            name: school.municipioNome,
            totalRisk: 0,
            schoolCount: 0,
            municipioSomaProjetos: 0,
          };
        }
        acc[school.municipioIdIbge].totalRisk +=
          school.scoreRiscoContextualizado;
        acc[school.municipioIdIbge].schoolCount += 1;
        acc[school.municipioIdIbge].municipioSomaProjetos =
          school.municipioSomaProjetos ?? 0;
        return acc;
      },
      {} as Record<
        string,
        {
          name: string;
          totalRisk: number;
          schoolCount: number;
          municipioSomaProjetos: number;
        }
      >,
    );

    const municipalitiesWithAverageRisk = Object.entries(
      municipalityRiskStats,
    ).map(([idIbge, stats]) => ({
      idIbge,
      name: stats.name,
      averageRisk: Number((stats.totalRisk / stats.schoolCount).toFixed(2)),
      schoolsCount: stats.schoolCount,
      municipioSomaProjetos: isNaN(stats.municipioSomaProjetos)
        ? 0
        : stats.municipioSomaProjetos,
    }));

    const highestAverageRiskMunicipality = municipalitiesWithAverageRisk.sort(
      (a, b) => b.averageRisk - a.averageRisk,
    )[0];

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

    const municipalitiesWithAverageRiskAndTotalProjects = Object.entries(
      municipalityRiskStats,
    ).map(([idIbge, stats]) => ({
      idIbge,
      name: stats.name,
      averageRisk: Number((stats.totalRisk / stats.schoolCount).toFixed(2)),
      totalProjects: isNaN(stats.municipioSomaProjetos)
        ? 0
        : stats.municipioSomaProjetos,
    }));

    const bestMunicipalityOpportunity =
      municipalitiesWithAverageRiskAndTotalProjects.sort((a, b) => {
        if (b.averageRisk !== a.averageRisk) {
          return b.averageRisk - a.averageRisk;
        }

        return a.totalProjects - b.totalProjects;
      })[0];

    return {
      schools: countDocuments,
      schoolsWithHighInfraestructureRisk:
        schoolsWithHighInfraestructureRisk.length,
      municipalitiesWithMostAverageRisk: highestAverageRiskMunicipality,
      lackName,
      bestMunicipalityOpportunity: bestMunicipalityOpportunity.name,
    };
  }
}
