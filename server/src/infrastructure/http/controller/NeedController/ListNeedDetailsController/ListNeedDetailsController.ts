import z from "zod";
import { ListNeedDetailsUseCase } from "../../../../../application/UseCases/NeedUseCases/ListNeedDetailsUseCase/ListNeedDetailsUseCase";

import { Request, Response } from "express"
import { Types } from "mongoose";

export class ListNeedDetailsController{
    constructor(
        private listNeedDetailsUseCase: ListNeedDetailsUseCase
    ){}

    async listDetails(req: Request, res: Response){
        
        const paramSchema = z.object({
            id: z.string().refine((val) => Types.ObjectId.isValid(val), {
                    message: 'Invalid MongoDB ObjectId',
            }),
        })

        const { id } = paramSchema.parse(req.params)

        const listNeedDetailsUseCase =  await this.listNeedDetailsUseCase.execute({ id })

        res.status(200).json(listNeedDetailsUseCase)

    }
}