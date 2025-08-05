import { Municipality } from '../entities/municipality';
import { UF } from '../enums/enumUnidadesFederativas';

export interface IMunicipalityRepository {
  findById(id: string): Promise<Municipality | null>;
  findByIbgeCode(codigoIbge: number): Promise<Municipality | null>
  findByName(name: string): Promise<Municipality | null>;
  findByUf(uf: UF): Promise<Municipality[]>;
  findAllForDropdown(): Promise<Pick<Municipality, 'id' | 'nome'>[]>;
  findAll(): Promise<Municipality[]>;
  delete(id: string): Promise<void>;
  update(municipality: Municipality): Promise<void>;
  save(municipality: Municipality): Promise<void>;
}
