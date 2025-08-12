import { randomUUID } from 'node:crypto';
import { UF } from '../enums/enumUnidadesFederativas';
import { MunicipalityValidator } from '../validators/municipalityValidator';

export type MunicipalityProps = {
  codigoIbge: string;

  nome: string;

  uf: UF;

  populacao: number;

  riscoMedio: number;

  totalEscolas: number;

  estatisticasInfraestrutura: Record<string, number>;
};

export class Municipality {
  public readonly id: string;

  public readonly codigoIbge: string;

  public nome: string;

  public readonly uf: UF;

  public populacao: number;

  public riscoMedio: number;

  public totalEscolas: number;

  public estatisticasInfraestrutura: Record<string, number>;

  constructor(props: MunicipalityProps, id?: string) {
    MunicipalityValidator.validate(props);

    this.id = id ?? randomUUID();

    this.codigoIbge = props.codigoIbge;

    this.nome = props.nome;

    this.uf = props.uf;

    this.populacao = props.populacao;

    this.riscoMedio = props.riscoMedio;

    this.totalEscolas = props.totalEscolas;

    this.estatisticasInfraestrutura = props.estatisticasInfraestrutura;
  }
}
