import { MunicipalitiesByRiskCountUseCase } from "../../../../../application/UseCases/DashboardUseCases/MunicipalitiesByRiskCountUseCase/MunicipalitiesByRiskCountUseCase";

import { Request, Response } from "express"

export class MunicipalitiesByRiskCountController{
    constructor(
        private municipalitiesByRiskCountUseCase: MunicipalitiesByRiskCountUseCase
    ){}

    async getMunicipalitiesWithMostRiskSchools(req: Request, res: Response){
        
        const municipalitiesWithMostRiskSchools = await this.municipalitiesByRiskCountUseCase.execute()

        res.status(200).json(municipalitiesWithMostRiskSchools)
    }
}