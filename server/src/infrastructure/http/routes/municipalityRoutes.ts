
import { Router } from "express"

import * as municipalityController from "../controller/MunicipalityController/index"

const municipalityRoutes = Router()

municipalityRoutes.get("/api/v1/municipalities", municipalityController.listMunicipalitiesController.listMunicipalitiesForDropdown.bind(municipalityController.listMunicipalitiesController))

municipalityRoutes.get("/api/v1/municipalities/:codigoIbge", municipalityController.getMunicipalityWithIbgeCodeController.getMunicipalityWithIbgeCode.bind(municipalityController.getMunicipalityWithIbgeCodeController))

municipalityRoutes.get("/api/v1/municipalities/:municipioIdIbge/statistics", municipalityController.getMunicipalityStatisticsController.getStatistics.bind(municipalityController.getMunicipalityStatisticsController))



export { municipalityRoutes }