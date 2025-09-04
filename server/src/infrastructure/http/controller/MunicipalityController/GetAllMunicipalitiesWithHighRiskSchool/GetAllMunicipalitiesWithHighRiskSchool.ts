import z from "zod";
import { GetAllMunicipalitiesWithHighRiskSchoolUseCase } from "../../../../../application/UseCases/MunicipalityUseCases/GetAllMunicipalitiesWithHighRiskSchool/GetAllMunicipalitiesWithHighRiskSchool/GetAllMunicipalitiesWithHighRiskSchool";


import { Request, Response } from "express"
import { dependenciaAdministrativa } from "../../../../../domain/enums/enumDependenciaAdministrativa";
import { tipoLocalizacao } from "../../../../../domain/enums/enumTipoLocalizacao";

export class GetAllMunicipalitiesWithHighRiskSchoolController{
    constructor(
        private getAllMunicipalitiesWithHighRiskSchoolUseCase: GetAllMunicipalitiesWithHighRiskSchoolUseCase
    ){}

    async getAllHighRiskSchoolsPerMunicipality(req: Request, res: Response){
    const querySchema = z
      .object({
        municipioIdIbge: z
          .string()
          .trim()
          .length(7, { message: 'Need  7 caracteres' })
          .optional(),
      })
      .strict();

    const filters = querySchema.parse(req.query);

    const getAllMunicipalitiesWithHighRiskSchool =
      await this.getAllMunicipalitiesWithHighRiskSchoolUseCase.execute(filters);

    res.status(200).json(getAllMunicipalitiesWithHighRiskSchool);
    }
}