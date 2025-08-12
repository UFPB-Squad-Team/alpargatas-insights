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

    const HIGH_RISK_THRESHOLD: number = 0.75;

    const theHighMunicipalitiesRisk: Record<string, { totalRisk: number; schoolCount: number;}> = {};

    let highestRiskMunicipality: { id: string; nome: string; averageRisk: number } = {id: "", nome: "", averageRisk: 0}

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

   const municipalityRiskStats = schoolsWithHighInfraestructureRisk.reduce((acc, school) => {
    if (!acc[school.municipioIdIbge]) {
      acc[school.municipioIdIbge] = {
        name: school.municipioNome,
        totalRisk: 0,
        schoolCount: 0
      };
    }
    acc[school.municipioIdIbge].totalRisk += school.scoreRisco;
    acc[school.municipioIdIbge].schoolCount += 1;
    return acc;
  }, {} as Record<string, { name: string; totalRisk: number; schoolCount: number }>);


  const municipalitiesWithAverageRisk = Object.entries(municipalityRiskStats)
    .map(([idIbge, stats]) => ({
      idIbge,
      name: stats.name,
      averageRisk: stats.totalRisk / stats.schoolCount,
      schoolsCount: stats.schoolCount
    }));


  const highestAverageRiskMunicipality = municipalitiesWithAverageRisk
    .sort((a, b) => b.averageRisk - a.averageRisk)[0];

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
      schoolsWithHighInfraestructureRisk: schoolsWithHighInfraestructureRisk.length,
      municipalitiesWithMostAverageRisk: highestAverageRiskMunicipality,
      lackName,
    };
  }
}
