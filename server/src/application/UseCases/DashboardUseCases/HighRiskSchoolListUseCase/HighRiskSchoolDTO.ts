import { School } from '../../../../domain/entities/school';

export interface HighRiskSchoolDTO {
  schoolsWithHighInfraestructureRisk: Pick<
    School,
    | 'id'
    | 'escolaIdInep'
    | 'escolaNome'
    | 'municipioNome'
    | 'municipioIdIbge'
    | 'scoreRisco'
    | 'localizacao'
    | 'dependenciaAdm'
    | 'infraestrutura'
  >[];
}
