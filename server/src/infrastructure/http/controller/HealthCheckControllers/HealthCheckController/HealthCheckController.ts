import { Request, Response } from 'express';
import healthCheckconnectDataBase from '../../../../configs/healthCheckDatabaseConnection';

export class HealthCheckController {
  async health(req: Request, res: Response) {
    await healthCheckconnectDataBase();

    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timeStamp: new Date().toISOString(),
    });
  }
}
