import { UF } from '../enums/enumUnidadesFederativas';
import { dependenciaAdministrativa } from '../enums/enumDependenciaAdministrativa';
import { tipoLocalizacao } from '../enums/enumTipoLocalizacao';

export type SchoolFromApi = {
  _id: string;
  escolaIdInep: number;
  dependenciaAdm: dependenciaAdministrativa;
  escolaNome: string;
  estadoSigla: UF;
  indicadores: {
    total_alunos: number;
  };
  infraestrutura: Record<string, boolean>;
  localizacao: {
    type: 'Point';
    coordinates: [number, number];
  };
  municipioIdIbge: number;
  municipioNome: string;
  scoreRisco: number;
  tipoLocalizacao: tipoLocalizacao;
};

export type School = {
  id: string;
  inep: number;
  nome: string;
  dependenciaAdm: dependenciaAdministrativa;
  estado: UF;
  municipioId: number;
  municipio: string;
  localizacaoTipo: tipoLocalizacao;
  coordenadas: [number, number];
  totalAlunos: number;
  infraestrutura: Record<string, boolean>;
  scoreDeRisco: number;
};
