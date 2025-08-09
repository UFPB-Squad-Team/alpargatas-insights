import z from "zod";
import { GetSchoolsByDependenciaAdministrativa } from "../../../../../application/UseCases/SchoolUseCases/GetSchoolsByDependenciaAdmnistrativaUseCase/GetSchoolsByDependenciaAdministrativaUseCase";

import { Request, Response } from "express"
import { dependenciaAdministrativa } from "../../../../../domain/enums/enumDependenciaAdministrativa";

export class GetSchoolsByDependenciaAdministrativaController{
    constructor(
        private getSchoolsByDependenciaAdministrativaUseCase: GetSchoolsByDependenciaAdministrativa
    ){}

    async getByDependenciaAdm(req: Request, res: Response){

        const paramSchema = z.object({
            dependenciaAdm: z.enum(dependenciaAdministrativa)
        })

        const { dependenciaAdm } = paramSchema.parse(req.params)

        const school = await this.getSchoolsByDependenciaAdministrativaUseCase.execute({ dependenciaAdm })

        res.status(200).json(school.length > 0 ? school : [])
    }
}