import { School } from '../entities/school';
import { dependenciaAdministrativa } from '../enums/enumDependenciaAdministrativa';
import { UF } from '../enums/enumUnidadesFederativas';

export interface ISchoolRepository {
  findById(id: string): Promise<School | null>;
  findByName(name: string): Promise<School | null>;
  findByUf(estadoSigla: UF): Promise<School[]>;
  findByDepAdm(dependenciaAdm: dependenciaAdministrativa): Promise<School[]>;
  findSearchByTerm(term: string, page: number, limit: number): Promise<School[]>
  findAllForMap(): Promise<
    Pick<School, 'id' | 'escolaNome' | 'localizacao' | 'scoreRisco'>[]
  >;
  findAll(): Promise<School[]>;
  delete(id: string): Promise<void>;
  update(school: School): Promise<void>;
  save(school: School): Promise<void>;
}
