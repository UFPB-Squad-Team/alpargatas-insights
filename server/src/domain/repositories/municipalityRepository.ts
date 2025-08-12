import { Municipality } from '../entities/municipality';
import { UF } from '../enums/enumUnidadesFederativas';

export interface IMunicipalityRepository {
  findByIbgeCode(codigoIbge: string): Promise<Municipality | null>;
  findByName(name: string): Promise<Municipality | null>;
  findByUf(uf: UF): Promise<Municipality[]>;
  findAllForDropdown(): Promise<Pick<Municipality, 'id' | 'nome'>[]>;
  findAll(): Promise<Municipality[]>;
}
