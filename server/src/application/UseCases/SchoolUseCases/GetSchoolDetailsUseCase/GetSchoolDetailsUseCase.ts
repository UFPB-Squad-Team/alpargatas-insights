import { ISchoolRepository } from "../../../../domain/repositories/schoolRepository";
import { HTTPSTATUS } from "../../../../infrastructure/configs/http";
import { AppError } from "../../../../shared/utils/errors/appError";
import { GetSchoolDetailsDTO } from "./GetSchoolDetailsDTO";

export class GetSchoolDetailsUseCase{
    constructor(
        private schoolRepository: ISchoolRepository
    ){}

    async execute({ id }: GetSchoolDetailsDTO){

        if( !id || typeof id !== 'string'){
            throw new AppError("School id invalid", HTTPSTATUS.BAD_REQUEST)
        }

        const schoolExist = await this.schoolRepository.findById(id)

        if(!schoolExist){
            throw new AppError("School not found", HTTPSTATUS.NOT_FOUND)
        }

        return schoolExist
    }
}