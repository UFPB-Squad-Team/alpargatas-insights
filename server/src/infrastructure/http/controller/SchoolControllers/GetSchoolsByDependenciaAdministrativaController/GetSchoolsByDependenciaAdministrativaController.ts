import z from 'zod';
import { GetSchoolsByDependenciaAdministrativa } from '../../../../../application/UseCases/SchoolUseCases/GetSchoolsByDependenciaAdmnistrativaUseCase/GetSchoolsByDependenciaAdministrativaUseCase';

import { Request, Response } from 'express';
import { dependenciaAdministrativa } from '../../../../../domain/enums/enumDependenciaAdministrativa';

export class GetSchoolsByDependenciaAdministrativaController {
  constructor(
    private getSchoolsByDependenciaAdministrativaUseCase: GetSchoolsByDependenciaAdministrativa,
  ) {}

  
  /**
   * @swagger
   * /api/v1/schools/details/{dependenciaAdm}:
   *   get:
   *     summary: Obtém escolas por dependência administrativa
   *     description: Retorna todas as escolas filtradas pelo tipo de dependência administrativa
   *     tags:
   *       - School
   *     parameters:
   *       - name: dependenciaAdm
   *         in: path
   *         description: Tipo de dependência administrativa
   *         required: true
   *         schema:
   *           type: string
   *           enum: ["Federal", "Estadual", "Municipal"]
   *           example: "Municipal"
   *     responses:
   *       '200':
   *         description: Lista de escolas obtida com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     example: "689ea6a3907a03b7b821a66f"
   *                   municipioIdIbge:
   *                     type: integer
   *                     example: 2501005
   *                   escolaIdInep:
   *                     type: integer
   *                     example: 25125710
   *                   escolaNome:
   *                     type: string
   *                     example: "EMEF MANOEL FRANCISCO MARTINIANO"
   *                   municipioNome:
   *                     type: string
   *                     example: "Araruna"
   *                   estadoSigla:
   *                     type: string
   *                     example: "PB"
   *                   dependenciaAdm:
   *                     type: string
   *                     example: "Municipal"
   *                   tipoLocalizacao:
   *                     type: string
   *                     example: "Rural"
   *                   localizacao:
   *                     type: object
   *                     properties:
   *                       coordinates:
   *                         type: array
   *                         items:
   *                           type: number
   *                         example: [-35.76372927005763, -6.565843414933229]
   *                       type:
   *                         type: string
   *                         example: "Point"
   *                   scoreRisco:
   *                     type: number
   *                     example: 0.55
   *                   scoreRiscoContextualizado:
   *                     type: number
   *                     example: 0.55
   *       '400':
   *         description: Parâmetro inválido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Tipo de dependência administrativa inválido"
   *       '500':
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Não foi possível obter as escolas por dependência administrativa"
   */

  async getByDependenciaAdm(req: Request, res: Response) {
    const paramSchema = z.object({
      dependenciaAdm: z.enum(dependenciaAdministrativa),
    });

    const { dependenciaAdm } = paramSchema.parse(req.params);

    const school =
      await this.getSchoolsByDependenciaAdministrativaUseCase.execute({
        dependenciaAdm,
      });

    res.status(200).json(school.length > 0 ? school : []);
  }
}
