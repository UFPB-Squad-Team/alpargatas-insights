import { GetAllSchoolsUseCase } from '../../../../../application/UseCases/SchoolUseCases/GetAllSchoolsUseCase/GetAllSchoolsUseCase';

import { Request, Response } from 'express';

export class GetAllSchoolsController {
  constructor(private getAllSchoolsUseCase: GetAllSchoolsUseCase) {}

  /**
   * @swagger
   * /schools/all:
   *   get:
   *     summary: Obtém todos as escolas do banco.
   *     description: >
   *       Este endpoint retorna uma coleção de escolas
   *     tags:
   *       - School
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
  async getAll(req: Request, res: Response) {
    const school = await this.getAllSchoolsUseCase.execute();

    res.status(200).json(school.length > 0 ? school : []);
  }
}
