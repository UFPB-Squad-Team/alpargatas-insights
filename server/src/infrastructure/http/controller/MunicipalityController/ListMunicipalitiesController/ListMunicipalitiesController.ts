import { ListMunicipalitiesUseCase } from '../../../../../application/UseCases/MunicipalityUseCases/ListMunicipalitiesUseCase/ListMunicipalitiesUseCase';

import { Request, Response } from 'express';

export class ListMunicipalitiesController {
  constructor(private listMunicipalitiesUseCase: ListMunicipalitiesUseCase) {}

  
  /**
   * @swagger
   * /api/v1/municipalities:
   *   get:
   *     summary: Obtém lista de municípios para dropdown
   *     description: Retorna todos os municípios com apenas ID e nome, ideal para uso em dropdowns e selects
   *     tags:
   *       - Municipality
   *     responses:
   *       '200':
   *         description: Lista de municípios obtida com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     description: Código IBGE do município
   *                     example: "2501005"
   *                   nome:
   *                     type: string
   *                     description: Nome do município
   *                     example: "Araruna"
   *       '500':
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Não foi possível obter a lista de municípios"
   */

  async listMunicipalitiesForDropdown(req: Request, res: Response) {
    const municipalities = await this.listMunicipalitiesUseCase.execute();

    res.status(200).json(municipalities.length > 0 ? municipalities : []);
  }
}
