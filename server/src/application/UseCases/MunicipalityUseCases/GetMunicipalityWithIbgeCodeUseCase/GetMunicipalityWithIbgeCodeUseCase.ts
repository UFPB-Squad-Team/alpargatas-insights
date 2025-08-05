import { IMunicipalityRepository } from "../../../../domain/repositories/municipalityRepository";
import { AppError } from "../../../../shared/utils/errors/appError";
import { GetMunicipalityWithIbgeCodeDTO } from "./GetMunicipalityWithIbgeCodeDTO";

export class GetMunicipalityWithIbgeCodeUseCase{
    constructor(
        private municipalityRepository: IMunicipalityRepository
    ){}

    async execute({ codigoIbge }: GetMunicipalityWithIbgeCodeDTO){

        if(!codigoIbge || typeof codigoIbge !== 'number'){
            throw new AppError("This code need be a number")
        }
        
        const municipality = await this.municipalityRepository.findByIbgeCode(codigoIbge)

        return municipality ?? 'No have a municipality with this code'
    }
}