import { randomUUID } from "node:crypto"
import { dependenciaAdministrativa } from "../enums/enumDependenciaAdministrativa"
import { UF } from "../enums/enumUnidadesFederativas"

type LocationCoordinates = [number, number]

type SchoolProps = {

    municipioId: string

    codigoInep: number

    nome: string

    municipioNome: string

    uf: UF

    dependenciaAdministrativa: dependenciaAdministrativa

    localizacao: {
        type: string
        coordinates: LocationCoordinates
    }

    scoreRisco: number

    indicadores: {
        total_alunos: number
        taxa_abandono_escolar: number
        taxa_reprovacao: number
    }

    corpo_docente: {
        total_professores: number
        percentual_docentes_com_superior: number
    }

    infraestrutura: Record<string, boolean>

}

export class School{
    public readonly id: string

    public municipioId: string

    public codigoInep: number

    public nome: string

    public municipioNome: string

    public uf: UF

    public dependenciaAdministrativa: dependenciaAdministrativa

    public localizacao: {
        type: string
        coordinates: LocationCoordinates
    }

    public scoreRisco: number

    public indicadores: {
        total_alunos: number
        taxa_abandono_escolar: number
        taxa_reprovacao: number
    }

    public corpo_docente: {
        total_professores: number
        percentual_docentes_com_superior: number
    }

    public infraestrutura: Record<string, boolean>

    constructor({ municipioId, codigoInep, nome, municipioNome, uf, dependenciaAdministrativa, localizacao, scoreRisco, indicadores, corpo_docente, infraestrutura }: SchoolProps, id?: string){

        this.id = id ?? randomUUID()

        this.municipioId = municipioId

        this.codigoInep = codigoInep

        this.nome = nome

        this.municipioNome = municipioNome

        this.uf = uf

        this.dependenciaAdministrativa = dependenciaAdministrativa

        this.localizacao = localizacao

        this.scoreRisco = scoreRisco

        this.indicadores = indicadores

        this.corpo_docente = corpo_docente

        this.infraestrutura = infraestrutura
    }

}