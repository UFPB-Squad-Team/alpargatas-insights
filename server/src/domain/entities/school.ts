import { randomUUID } from 'node:crypto';
import { dependenciaAdministrativa } from '../enums/enumDependenciaAdministrativa';
import { UF } from '../enums/enumUnidadesFederativas';
import { SchoolValidator } from '../validators/schoolValidator';
import { tipoLocalizacao } from '../enums/enumTipoLocalizacao';

type LocationCoordinates = [number, number];

export type SchoolProps = {
  municipioIdIbge: string;

  escolaIdInep: number;

  escolaNome: string;

  municipioNome: string;

  estadoSigla: UF;

  dependenciaAdm: dependenciaAdministrativa;

  tipoLocalizacao: tipoLocalizacao

  localizacao: {
    type: string;
    coordinates: LocationCoordinates;
  };

  scoreRisco: number;

  indicadores: {
    total_alunos: number;
  };

  infraestrutura: Record<string, boolean>;
};

export class School {
  public readonly id: string;

  public municipioIdIbge: string;

  public readonly escolaIdInep: number;

  public escolaNome: string;

  public municipioNome: string;

  public readonly estadoSigla: UF;

  public dependenciaAdm: dependenciaAdministrativa;

  public tipoLocalizacao: tipoLocalizacao

  public localizacao: {
    type: string;
    coordinates: LocationCoordinates;
  };

  public scoreRisco: number;

  public indicadores: {
    total_alunos: number;
  };

  public infraestrutura: Record<string, boolean>;

  constructor(props: SchoolProps, id?: string) {
    // Aqui faz a validação das propriedades
    SchoolValidator.validate(props);

    this.id = id ?? randomUUID();

    this.municipioIdIbge = props.municipioIdIbge;

    this.escolaIdInep = props.escolaIdInep;

    this.escolaNome = props.escolaNome;

    this.municipioNome = props.municipioNome;

    this.estadoSigla = props.estadoSigla;

    this.dependenciaAdm = props.dependenciaAdm;

    this.tipoLocalizacao = props.tipoLocalizacao

    this.localizacao = props.localizacao;

    this.scoreRisco = props.scoreRisco;

    this.indicadores = props.indicadores;

    this.infraestrutura = props.infraestrutura;
  }
}
