import { randomUUID } from 'node:crypto';
import { dependenciaAdministrativa } from '../enums/enumDependenciaAdministrativa';
import { UF } from '../enums/enumUnidadesFederativas';
import { SchoolValidator } from '../validators/schoolValidator';

type LocationCoordinates = [number, number];

export type SchoolProps = {
  municipioId: string;

  codigoInep: number;

  nome: string;

  municipioNome: string;

  uf: UF;

  dependenciaAdministrativa: dependenciaAdministrativa;

  localizacao: {
    type: string;
    coordinates: LocationCoordinates;
  };

  scoreRisco: number;

  indicadores: {
    total_alunos: number;
    taxa_abandono_escolar: number;
    taxa_reprovacao: number;
  };

  corpo_docente: {
    total_professores: number;
    percentual_docentes_com_superior: number;
  };

  infraestrutura: Record<string, boolean>;
};

export class School {
  public readonly id: string;

  public municipioId: string;

  public readonly codigoInep: number;

  public nome: string;

  public municipioNome: string;

  public readonly uf: UF;

  public dependenciaAdministrativa: dependenciaAdministrativa;

  public localizacao: {
    type: string;
    coordinates: LocationCoordinates;
  };

  public scoreRisco: number;

  public indicadores: {
    total_alunos: number;
    taxa_abandono_escolar: number;
    taxa_reprovacao: number;
  };

  public corpo_docente: {
    total_professores: number;
    percentual_docentes_com_superior: number;
  };

  public infraestrutura: Record<string, boolean>;

  constructor(props: SchoolProps, id?: string) {
    // Aqui faz a validação das propriedades
    SchoolValidator.validate(props);

    this.id = id ?? randomUUID();

    this.municipioId = props.municipioId;

    this.codigoInep = props.codigoInep;

    this.nome = props.nome;

    this.municipioNome = props.municipioNome;

    this.uf = props.uf;

    this.dependenciaAdministrativa = props.dependenciaAdministrativa;

    this.localizacao = props.localizacao;

    this.scoreRisco = props.scoreRisco;

    this.indicadores = props.indicadores;

    this.corpo_docente = props.corpo_docente;

    this.infraestrutura = props.infraestrutura;
  }
}
