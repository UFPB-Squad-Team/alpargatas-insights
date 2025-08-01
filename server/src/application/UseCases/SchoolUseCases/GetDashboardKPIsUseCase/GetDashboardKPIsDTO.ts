import { Municipality } from "../../../../domain/entities/municipality"
import { School } from "../../../../domain/entities/school"

export interface GetDashboardKPIsDTO{
    schools: number
    schoolsWithHighInfraestructureRisk: Pick<School, 'id' | 'codigoInep' | 'nome' | 'municipioNome' | 'municipioId' | 'scoreRisco' | 'localizacao' | 'dependenciaAdministrativa' | 'infraestrutura'>[]
    municipalitiesWithMostSchoolsInHighRisk: Municipality[]
    lackName: string
}