
import { ISchoolRepository } from "../../../../domain/repositories/schoolRepository";
import { GetSchoolsByDependenciaAdministrativaDTO } from "./GetSchoolsByDependenciaAdministrativaDTO";


export class GetSchoolsByDependenciaAdministrativa{
    constructor(
        private schoolRepository: ISchoolRepository
    ){}

    async execute({ dependenciaAdministrativa }: GetSchoolsByDependenciaAdministrativaDTO){

        const schoolsByDependenciaAdministrativa = await this.schoolRepository.findByDepAdm(dependenciaAdministrativa)

        return schoolsByDependenciaAdministrativa || []
    }
}