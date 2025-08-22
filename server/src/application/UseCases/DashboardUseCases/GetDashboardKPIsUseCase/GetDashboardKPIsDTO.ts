import { Municipality } from '../../../../domain/entities/municipality';
import { School } from '../../../../domain/entities/school';

export interface GetDashboardKPIsDTO {
  schools: number;
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
  municipalitiesWithMostSchoolsInHighRisk: Municipality[];
  lackName: string;
}
