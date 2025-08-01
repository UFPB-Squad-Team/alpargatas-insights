
import { IMunicipalityRepository } from "../../../../domain/repositories/municipalityRepository";
import { ISchoolRepository } from "../../../../domain/repositories/schoolRepository";
import { GetDashboardKPIsDTO } from "./GetDashboardKPIsDTO";

export class GetDashboardKPIsUseCase{
    constructor(
        private schoolRepository: ISchoolRepository,
        private municipalityRepository: IMunicipalityRepository
    ){}

    async execute(): Promise<GetDashboardKPIsDTO> {
        
        const schools = await this.schoolRepository.findAll()

        const municipalities = await this.municipalityRepository.findAll()

        let theHighMunicipalitiesRisk =  new Map<string, number>()

        let lackCountMax : number = 0

        let lackName: string = 'No lacks identify'
        
        const schoolsWithHighInfraestructureRisk = schools.filter((school) => school.scoreRisco >= 0.75 ).map(school => ({
            id: school.id,
            codigoInep: school.codigoInep,
            nome: school.nome,
            municipioNome: school.municipioNome,
            municipioId: school.municipioId,
            dependenciaAdministrativa: school.dependenciaAdministrativa,
            uf: school.uf,
            scoreRisco: school.scoreRisco,
            infraestrutura: school.infraestrutura,
            localizacao: school.localizacao
        }))

        schoolsWithHighInfraestructureRisk.forEach((schools) => {
            const count = theHighMunicipalitiesRisk.get(schools.municipioId) || 0

            theHighMunicipalitiesRisk.set(schools.municipioId, count + 1)
        })

        const municipalitiesWithMostSchoolsInHighRisk = municipalities.filter((municipality) => {
            const count = theHighMunicipalitiesRisk.get(municipality.id) || 0

            return count >= 5
        })

        const countDocuments = schools.length

        const mostInfraestructureMistake = new Map<string, number>()

        schools.forEach((school) => {
            Object.entries(school.infraestrutura).forEach(([item, available]) => {
                if(!available){
                    mostInfraestructureMistake.set(item, (mostInfraestructureMistake.get(item) || 0) + 1)
                }
            })
        })

        mostInfraestructureMistake.forEach((count, item) => {
            if(count > lackCountMax){
                lackCountMax = count
                lackName = item
            }
        })

        return {
            schools: countDocuments,
            schoolsWithHighInfraestructureRisk,
            municipalitiesWithMostSchoolsInHighRisk,
            lackName
        }
    }
}