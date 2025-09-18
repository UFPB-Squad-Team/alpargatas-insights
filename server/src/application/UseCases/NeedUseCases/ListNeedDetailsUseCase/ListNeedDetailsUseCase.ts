import { INeedRepository } from "../../../../domain/repositories/needRepository";
import { AppError } from "../../../../shared/utils/errors/appError";
import { ListNeedDetailsInputDTO } from "./ListNeedDetailsInputDTO";
import { ListNeedDetailsOutputDTO } from "./ListNeedDetailsOutputDTO";

export class ListNeedDetailsUseCase{
    constructor(
        private needRepository: INeedRepository
    ){}

    async execute({ id }: ListNeedDetailsInputDTO): Promise<ListNeedDetailsOutputDTO>{
        
        const needExist = await this.needRepository.findById(id)

        if(!needExist){
            throw new AppError("This need don't exist", 404)
        }


        return {
            title: needExist.title,
            description: needExist.description,
            type: needExist.type,
            submitterType: needExist.submitterType,
            submitterContact: needExist.submitterContact,
            location: needExist.location,
            status: needExist.status
        }

    }
}