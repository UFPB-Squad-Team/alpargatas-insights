import { HighRiskSchoolUseCase } from "../../../../../application/UseCases/DashboardUseCases/HighRiskSchoolListUseCase/HighRiskSchoolUseCase";

import { Request, Response } from "express"

export class HighRiskSchoolController{
    constructor(
        private highRiskSchoolUseCase: HighRiskSchoolUseCase
    ){}

    async getRiskSchools(req: Request, res: Response){
        const highRiskSchools = await this.highRiskSchoolUseCase.execute()

        return res.status(200).json(highRiskSchools)
    }
}