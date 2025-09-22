import z from 'zod';
import { HighRiskSchoolUseCase } from '../../../../../application/UseCases/DashboardUseCases/HighRiskSchoolListUseCase/HighRiskSchoolUseCase';

import { Request, Response } from 'express';
import { dependenciaAdministrativa } from '../../../../../domain/enums/enumDependenciaAdministrativa';
import { tipoLocalizacao } from '../../../../../domain/enums/enumTipoLocalizacao';

export class HighRiskSchoolController {
  constructor(private highRiskSchoolUseCase: HighRiskSchoolUseCase) {}

  /**
   * @swagger
   * /api/v1/dashboard/high-risk-schools:
   *   get:
   *     summary: Obtém lista paginada de escolas de alto risco
   *     description: Retorna uma lista paginada de escolas com score de risco superior a 0.75
   *     tags:
   *       - Dashboard
   *     parameters:
   *       - name: page
   *         in: query
   *         description: Número da página
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *           example: 1
   *       - name: limit
   *         in: query
   *         description: Número de itens por página
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *           example: 10
   *     responses:
   *       '200':
   *         description: Lista de escolas de alto risco obtida com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 schools:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         example: "689ea6a3907a03b7b821a66f"
   *                       municipioIdIbge:
   *                         type: integer
   *                         example: 2501005
   *                       escolaIdInep:
   *                         type: integer
   *                         example: 25125710
   *                       escolaNome:
   *                         type: string
   *                         example: "EMEF MANOEL FRANCISCO MARTINIANO"
   *                       municipioNome:
   *                         type: string
   *                         example: "Araruna"
   *                       estadoSigla:
   *                         type: string
   *                         example: "PB"
   *                       dependenciaAdm:
   *                         type: string
   *                         example: "Municipal"
   *                       tipoLocalizacao:
   *                         type: string
   *                         example: "Rural"
   *                       localizacao:
   *                         type: object
   *                         properties:
   *                           coordinates:
   *                             type: array
   *                             items:
   *                               type: number
   *                             example: [-35.76372927005763, -6.565843414933229]
   *                           type:
   *                             type: string
   *                             example: "Point"
   *                       scoreRisco:
   *                         type: number
   *                         example: 0.85
   *                       scoreRiscoContextualizado:
   *                         type: number
   *                         example: 0.82
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     currentPage:
   *                       type: integer
   *                       example: 1
   *                     Pages:
   *                       type: integer
   *                       example: 5
   *                     total:
   *                       type: integer
   *                       example: 48
   *       '400':
   *         description: Parâmetros de paginação inválidos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Page/Limit need be greater than 0"
   *       '500':
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Não foi possível obter a lista de escolas de alto risco"
   */

  async getRiskSchools(req: Request, res: Response) {
    const querySchema = z
      .object({
        page: z.coerce
          .number()
          .gt(0, { message: 'Page need be greater than 0' }),

        limit: z.coerce
          .number()
          .gt(0, { message: 'Limit need be greater than 0' }),
        municipioIdIbge: z
          .string()
          .trim()
          .length(7, { message: 'Need  7 caracteres' })
          .optional(),
        dependenciaAdm: z.enum(dependenciaAdministrativa).optional(),
        tipoLocalizacao: z.enum(tipoLocalizacao).optional(),
        municipioSomaProjetos: z.unknown().optional()
      })
      .strict();

    const { page, limit, ...filters } = querySchema.parse(req.query);

    const highRiskSchools = await this.highRiskSchoolUseCase.execute({
      filters,
      page,
      limit,
    });

    return res.status(200).json(highRiskSchools);
  }
}
