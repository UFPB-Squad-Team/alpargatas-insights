import z from "zod";
import { CreateNeedUseCase } from "../../../../../application/UseCases/NeedUseCases/CreateNeedUseCase/CreateNeedUseCase";

import { Request, Response } from "express"
import { NeedType } from "../../../../../domain/enums/Need/enumNeedType";
import { SubmitterType } from "../../../../../domain/enums/Need/enumSubmitterType";
import { NeedStatus } from "../../../../../domain/enums/Need/enumNeedStatus";

export class CreateNeedController{
    constructor(
        private createNeedUseCase: CreateNeedUseCase
    ){}

    /**
     * @swagger
     * /api/v1/needs:
     *   post:
     *     summary: Create a new need
     *     description: Creates a new need request with the provided information
     *     tags:
     *       - Needs
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - title
     *               - description
     *               - type
     *               - submitterType
     *             properties:
     *               title:
     *                 type: string
     *                 description: Title of the need
     *                 example: "Urgent need for school supplies"
     *               description:
     *                 type: string
     *                 description: Detailed description of the need
     *                 example: "We need 50 notebooks and 100 pencils for underprivileged students"
     *               type:
     *                 enum: infrastructure, material, hr, social, other
     *               submitterType:
     *                 enum: student, teacher, manager, ngo, community, 
     *               submitterContact:
     *                 type: object
     *                 description: Contact information of the submitter
     *                 properties:
     *                   name:
     *                     type: string
     *                     description: Name of the submitter
     *                     example: "John Doe"
     *                   email:
     *                     type: string
     *                     format: email
     *                     description: Email of the submitter
     *                     example: "john.doe@example.com"
     *               location:
     *                 type: object
     *                 description: Location information (school or municipality)
     *                 properties:
     *                   locationType:
     *                     type: string
     *                     enum: ['school', 'municipality']
     *                     description: Type of location
     *                     example: "school"
     *                   id:
     *                     type: string
     *                     description: ID of the location
     *                     example: "school-123"
     *                   name:
     *                     type: string
     *                     description: Name of the location
     *                     example: "Central Elementary School"
     *               status:
     *                 enum: pending, approved, rejected
     *     responses:
     *       201:
     *         description: Need created successfully
     *       400:
     *         description: Invalid input data
     *       500:
     *         description: Internal server error
     */

    async create(req: Request, res: Response){
        const bodySchema = z.object({
            title: z.string().min(1).max(100),
            description: z.string().min(10).max(1000),
            type: z.nativeEnum(NeedType),
            submitterType: z.nativeEnum(SubmitterType),
            submitterContact: z.object({
                name: z.string().optional(),
                email: z.string().email().optional()
            }).optional(),
            location: z.object({
                locationType: z.enum(['school', 'municipality']),
                id: z.string(),
                name: z.string()
            }).optional(),
            status: z.nativeEnum(NeedStatus).default(NeedStatus.PENDING)
    });

    const { title, description, type, submitterType, submitterContact, location, status } = bodySchema.parse(req.body)

    const createNeedUseCase = await this.createNeedUseCase.execute({ title, description, type, submitterType, submitterContact, location, status })

    res.status(201).json(createNeedUseCase)
    
    }
}