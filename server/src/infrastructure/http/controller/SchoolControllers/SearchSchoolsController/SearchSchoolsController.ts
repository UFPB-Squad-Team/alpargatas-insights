import z from 'zod';
import { SearchSchoolsUseCase } from '../../../../../application/UseCases/SchoolUseCases/SearchSchoolsUseCase/SearchSchoolsUseCase';

import { Request, Response } from 'express';

export class SearchSchoolsController {
  constructor(private searchSchoolsUseCase: SearchSchoolsUseCase) {}
  /**
   * @swagger
   * /schools:
   *   get:
   *     summary: Obtém as escolas por um termo específico.
   *     description: >
   *       Este endpoint retorna uma coleção de escolas com o termo correspondente,
   *       incluindo informações detalhadas sobre localização, infraestrutura e indicadores de risco.
   *     tags:
   *       - School
   *     parameters:
   *       - name: term
   *         in: query
   *         description: Termo para busca de escolas
   *         required: true
   *         schema:
   *           type: string
   *       - name: page
   *         in: query
   *         description: Número da página atual
   *         required: true
   *         schema:
   *           type: number
   *       - name: limit
   *         in: query
   *         description: Limite de escolas por página
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       '200':
   *         description: Escolas obtidas com sucesso.
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
   *                         example: 0.55
   *                       scoreRiscoContextualizado:
   *                         type: number
   *                         example: 0.55
   *                       indicadores:
   *                         type: object
   *                         properties:
   *                           total_alunos:
   *                             type: integer
   *                             example: 17
   *                       infraestrutura:
   *                         type: object
   *                         properties:
   *                           possui_acessibilidade_pcd:
   *                             type: boolean
   *                             example: true
   *                           possui_agua_potavel:
   *                             type: boolean
   *                             example: true
   *                           possui_biblioteca:
   *                             type: boolean
   *                             example: false
   *                           possui_energia_publica:
   *                             type: boolean
   *                             example: true
   *                           possui_internet:
   *                             type: boolean
   *                             example: true
   *                           possui_quadra_esportes:
   *                             type: boolean
   *                             example: false
   *                           possui_saneamento_basico:
   *                             type: boolean
   *                             example: false
   *                 totalCount:
   *                   type: integer
   *                   example: 150
   *                 currentPage:
   *                   type: integer
   *                   example: 1
   *                 totalPages:
   *                   type: integer
   *                   example: 15
   *       '400':
   *         description: Parâmetros inválidos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Term need min 1 caracter"
   *       '500':
   *         description: Erro interno do servidor.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Não foi possível obter os dados das escolas."
   */
  async searchSchools(req: Request, res: Response) {
    const querySchema = z.object({
      term: z.string().min(1, { message: 'Term need min 1 caracter' }),
      page: z.coerce.number().gt(0, { message: 'Page need be greater than 0' }),
      limit: z.coerce
        .number()
        .gt(0, { message: 'Limit need be greater than 0' }),
    });

    const { term, page, limit } = querySchema.parse(req.query);

    const searchResult = await this.searchSchoolsUseCase.execute({
      term,
      page,
      limit,
    });

    res.status(200).json(searchResult);
  }
}
