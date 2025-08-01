import { School } from '../entities/school';
import { dependenciaAdministrativa } from '../enums/enumDependenciaAdministrativa';
import { UF } from '../enums/enumUnidadesFederativas';

export interface ISchoolRepository {
  findById(id: string): Promise<School | null>;
  findByName(name: string): Promise<School | null>;
  findByUf(uf: UF): Promise<School[]>;
  findByDepAdm(
    dependenciaAdministrativa: dependenciaAdministrativa,
  ): Promise<School[]>;
  findAllForMap(): Promise<Pick<School, 'id' | 'nome' | 'localizacao' | 'scoreRisco'>[]>
  findAll(): Promise<School[]>;
  delete(id: string): Promise<void>;
  update(school: School): Promise<void>;
  save(school: School): Promise<void>;
}
