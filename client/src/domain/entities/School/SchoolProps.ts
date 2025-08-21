import { UF } from '../../enums/enumUnidadesFederativas';
import { dependenciaAdministrativa } from '../../enums/enumDependenciaAdministrativa';
import { tipoLocalizacao } from '../../enums/enumTipoLocalizacao';

/**
 * @description Contract that represents EXACTLY the API response for a complete school.
 * Note the mixed naming (camelCase and snake_case) and the _id field.
 */
export type SchoolFromApi = {
  _id: string;
  escolaIdInep: number;
  escolaNome: string;
  municipioIdIbge: number;
  municipioNome: string;
  estadoSigla: UF;
  dependenciaAdm: dependenciaAdministrativa;
  tipoLocalizacao: tipoLocalizacao;
  localizacao: {
    type: 'Point';
    coordinates: [number, number];
  };
  indicadores: {
    total_alunos: number;
  };
  infraestrutura: Record<string, boolean>;
  scoreRisco: number;
  municipioSomaProjetos?: number;
  municipioSomaBeneficiados?: number;
  municipioMediaIdeb2023?: number;
  risco_ideb_municipio?: number;
  scoreRiscoContextualizado: number;
};

/**
 * @description Our internal domain model. Clean, standardized, and in camelCase.
 * This is the type that our components and hooks will use.
 */
export type School = {
  id: string;
  inep: number;
  nome: string;
  municipioId: number;
  municipio: string;
  estado: UF;
  dependenciaAdm: dependenciaAdministrativa;
  localizacaoTipo: tipoLocalizacao;
  coordenadas: [number, number];
  totalAlunos: number;
  infraestrutura: Record<string, boolean>;
  scoreDeRisco: number;
  projetosNoMunicipio?: number;
  beneficiadosNoMunicipio?: number;
  idebMedioMunicipio?: number;
  riscoIdebMunicipio?: number;
  scoreRiscoContextualizado: number;
};
