import z from 'zod';
import { ListSchoolsForMapUseCase } from '../../../../../application/UseCases/SchoolUseCases/ListSchoolsForMapUseCase/ListSchoolsForMapUseCase';

import { Request, Response } from 'express';
import { dependenciaAdministrativa } from '../../../../../domain/enums/enumDependenciaAdministrativa';
import { tipoLocalizacao } from '../../../../../domain/enums/enumTipoLocalizacao';

export class ListSchoolsForMapController {
  constructor(private listSchoolsForMapUseCase: ListSchoolsForMapUseCase) {}

  /**
   * @swagger
   * /api/v1/dashboard/map-data:
   *   get:
   *     summary: Obtém dados simplificados de escolas para exibição em mapa
   *     description: Retorna uma lista com dados essenciais das escolas para visualização em mapa (id, nome, score de risco e coordenadas)
   *     tags:
   *       - Dashboard
   *     responses:
   *       '200':
   *         description: Lista de escolas para mapa obtida com sucesso
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
   *                   escolaNome:
   *                     type: string
   *                     example: "EMEF MANOEL FRANCISCO MARTINIANO"
   *                   scoreRisco:
   *                     type: number
   *                     example: 0.65
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
   *       '500':
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Não foi possível obter os dados das escolas para o mapa"
   */
  async listSchoolsForMap(req: Request, res: Response) {
    const querySchema = z
      .object({
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

    const filters = querySchema.parse(req.query);

    const school = await this.listSchoolsForMapUseCase.execute(filters);

    res.status(200).json(school.length > 0 ? school : []);
  }
}
