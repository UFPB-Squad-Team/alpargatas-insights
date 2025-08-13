import z from "zod";
import { GetMunicipalityWithIbgeCodeUseCase } from "../../../../../application/UseCases/MunicipalityUseCases/GetMunicipalityWithIbgeCodeUseCase/GetMunicipalityWithIbgeCodeUseCase";

import { Request, Response } from "express"

export class GetMunicipalityWithIbgeCodeController{
    constructor(
        private getMunicipalityWithIbgeCodeUseCase: GetMunicipalityWithIbgeCodeUseCase
    ){}

    async getMunicipalityWithIbgeCode(req: Request, res: Response){
        const paramSchema = z.object({
            codigoIbge: z.string().trim().length(7, { message: "Need  7 caracteres" })
        })

        const { codigoIbge } = paramSchema.parse(req.params)

        const municipality = await this.getMunicipalityWithIbgeCodeUseCase.execute({ codigoIbge })
        
        res.status(200).json(municipality)
    }

}