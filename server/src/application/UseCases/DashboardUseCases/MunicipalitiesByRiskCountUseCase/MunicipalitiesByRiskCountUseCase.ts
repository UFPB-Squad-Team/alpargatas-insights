import { ISchoolRepository } from "../../../../domain/repositories/schoolRepository";
import { MunicipalitiesByRiskCountReturnDTO } from "./MunicipalitiesByRiskCountReturnDTO";

export class MunicipalitiesByRiskCountUseCase{

    private readonly HIGH_RISK_THRESHOLD = 0.75;

    constructor(
        private schoolRepository: ISchoolRepository
    ){}

    async execute(): Promise<MunicipalitiesByRiskCountReturnDTO>{

        const schools = await this.schoolRepository.findAll()

        
        const schoolsWithHighInfraestructureRisk = schools
            .filter((school) => school.scoreRiscoContextualizado >= this.HIGH_RISK_THRESHOLD)
            .map((school) => ({
                id: school.id,
                escolaIdInep: school.escolaIdInep,
                escolaNome: school.escolaNome,
                municipioNome: school.municipioNome,
                municipioIdIbge: school.municipioIdIbge,
                dependenciaAdm: school.dependenciaAdm,
                estadoSigla: school.estadoSigla,
                scoreRisco: school.scoreRisco,
                scoreRiscoContextualizado: school.scoreRiscoContextualizado,
                infraestrutura: school.infraestrutura,
                localizacao: school.localizacao,
            }));

        const municipalityRiskStats = schoolsWithHighInfraestructureRisk.reduce(
        (acc, school) => {
            if (!acc[school.municipioIdIbge]) {
            acc[school.municipioIdIbge] = {
                name: school.municipioNome,
                schoolCount: 0,
            };
            }
            acc[school.municipioIdIbge].schoolCount += 1;
            return acc;
        },
        {} as Record<
            string,
            { name: string; schoolCount: number }
        >,
        );

        const schoolsWithHighRiskPerMunicipality = Object.entries(municipalityRiskStats).map(([idIbge, stats]) => ({
            idIbge,
            name: stats.name,
            schoolCount: stats.schoolCount
        })).sort((a, b) => b.schoolCount - a.schoolCount).slice(0, 10)

        return {
            schoolsWithHighRiskPerMunicipality
        }
    }
}