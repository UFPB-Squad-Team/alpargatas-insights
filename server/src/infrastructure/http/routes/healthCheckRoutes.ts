
import { Router } from "express"

import { healthCheckController } from "../controller/HealthCheckControllers/index"

const healthCheckRoutes = Router()

healthCheckRoutes.get("/health", healthCheckController.health)

export { healthCheckRoutes }