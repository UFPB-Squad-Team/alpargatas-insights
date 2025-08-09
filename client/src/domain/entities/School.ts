import { UF } from '../enums/enumUnidadesFederativas'; // Supondo que você tenha esses enums
import { dependenciaAdministrativa } from '../enums/enumDependenciaAdministrativa';
import { tipoLocalizacao } from '../enums/enumTipoLocalizacao';

type LocationCoordinates = [number, number];

export type SchoolProps = {
  escola_id_inep: number;
  escola_nome: string;
  municipio_id_ibge: number;
  municipio_nome: string;
  estado_sigla: UF;
  dependencia_adm: dependenciaAdministrativa;
  tipo_localizacao: tipoLocalizacao;
  localizacao: {
    type: 'Point';
    coordinates: LocationCoordinates;
  };
  indicadores: {
    total_alunos: number;
  };
  infraestrutura: Record<string, boolean>;
  score_de_risco: number;
};
