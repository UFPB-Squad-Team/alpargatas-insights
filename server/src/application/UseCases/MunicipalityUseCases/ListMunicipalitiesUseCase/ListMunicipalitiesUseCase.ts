import { IMunicipalityRepository } from "../../../../domain/repositories/municipalityRepository";

export class ListMunicipalitiesUseCase{
    constructor(
        private municipalityRepository: IMunicipalityRepository
    ){}

    async execute(){
        const municipality =  await this.municipalityRepository.findAllForDropdown()

        return municipality || []
    }
}