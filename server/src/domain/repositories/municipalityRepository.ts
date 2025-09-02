import { Municipality } from '../entities/municipality';
import { UF } from '../enums/enumUnidadesFederativas';

export interface IMunicipalityRepository {
  findByIbgeCode(codigoIbge: string): Promise<Municipality | null>;
  findByName(name: string): Promise<Municipality | null>;
  findByUf(uf: UF): Promise<Municipality[]>;
  findAllForDropdown(page: number, limit: number): Promise<{ municipalities: Pick<Municipality, 'id' | 'nome'>[], page: number, total: number, currentPage: number  }>;
  findAll(): Promise<Municipality[]>;
}
