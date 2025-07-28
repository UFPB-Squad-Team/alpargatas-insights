import { randomUUID } from "node:crypto"
import { UF } from "../enums/enumUnidadesFederativas"

type MunicipalityProps = {
    codigoIbge: number

    nome: string

    uf: UF

    populacao: number

    riscoMedio: number

    totalEscolas: number

    estatisticasInfraestrutura: Record<string,number>
}

export class Municipality{
    public readonly id: string

    public codigoIbge: number

    public nome: string

    public uf: UF

    public populacao: number

    public riscoMedio: number

    public totalEscolas: number

    public estatisticasInfraestrutura: Record<string,number>

    constructor({ codigoIbge, nome, uf, populacao,riscoMedio, totalEscolas, estatisticasInfraestrutura }: MunicipalityProps, id?: string){

        this.id = id ?? randomUUID()

        this.codigoIbge = codigoIbge

        this.nome = nome

        this.uf = uf

        this.populacao = populacao

        this.riscoMedio = riscoMedio

        this.totalEscolas = totalEscolas

        this.estatisticasInfraestrutura = estatisticasInfraestrutura
    }
}