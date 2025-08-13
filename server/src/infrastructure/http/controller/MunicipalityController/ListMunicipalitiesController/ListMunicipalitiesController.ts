import { ListMunicipalitiesUseCase } from "../../../../../application/UseCases/MunicipalityUseCases/ListMunicipalitiesUseCase/ListMunicipalitiesUseCase";

import { Request, Response } from "express"

export class ListMunicipalitiesController{
    constructor(
        private listMunicipalitiesUseCase: ListMunicipalitiesUseCase
    ){}

    async listMunicipalitiesForDropdown(req: Request, res: Response){

        const municipalities = await this.listMunicipalitiesUseCase.execute()

        res.status(200).json(municipalities.length > 0 ? municipalities : [])
    }
}