import { ISchoolRepository } from "../../../../domain/repositories/schoolRepository";
import { HighRiskSchoolDTO } from "./HighRiskSchoolDTO";

export class HighRiskSchoolUseCase{
    constructor(
        private schoolRepository: ISchoolRepository
    ){}

    async execute(): Promise<HighRiskSchoolDTO>{
        const schools = await this.schoolRepository.findAll();

        const HIGH_RISK_THRESHOLD: number = 0.75;

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

      return {
        schoolsWithHighInfraestructureRisk
      }
    }
}