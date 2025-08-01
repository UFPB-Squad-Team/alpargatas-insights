import { ISchoolRepository } from "../../../../domain/repositories/schoolRepository";

export class GetAllSchoolsUseCase{
    constructor(
        private schoolRepository: ISchoolRepository
    ){}

    async execute(){
        return await this.schoolRepository.findAll()
    }
}