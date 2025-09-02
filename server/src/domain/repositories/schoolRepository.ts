import { School } from '../entities/school';
import { dependenciaAdministrativa } from '../enums/enumDependenciaAdministrativa';
import { UF } from '../enums/enumUnidadesFederativas';

export interface ISchoolRepository {
  findById(id: string): Promise<School | null>;
  findByIbgeCode(municipioIdIbge: string): Promise<School[]>;
  findByName(name: string): Promise<School | null>;
  findByUf(estadoSigla: UF): Promise<School[]>;
  findByDepAdm(dependenciaAdm: dependenciaAdministrativa): Promise<School[]>;
  findSearchByTerm(
    term: string,
    page: number,
    limit: number,
  ): Promise<{
    schools: School[];
    total: number;
    page: number;
    currentPage: number;
  }>;
  pagination(
    page: number,
    limit: number,
    threshold?: number,
  ): Promise<{
    schools: School[];
    total: number;
    page: number;
    currentPage: number;
  }>;
  findWithFilters(
    riskTrheshold: number,
    filters?: Partial<School>,
    page?: number,
    limit?: number,
  ): Promise<School[]>;
  getRiskDistribution(
    thresholds: { high: number; medium: number; low: number },
    filters?: Partial<School>,
  ): Promise<School[]>;
  findAllForMap(
    filters?: Partial<School>,
  ): Promise<
    Pick<
      School,
      'id' | 'escolaNome' | 'localizacao' | 'scoreRiscoContextualizado'
    >[]
  >;
  findAll(): Promise<School[]>;
  delete(id: string): Promise<void>;
  update(school: School): Promise<void>;
  save(school: School): Promise<void>;
}
