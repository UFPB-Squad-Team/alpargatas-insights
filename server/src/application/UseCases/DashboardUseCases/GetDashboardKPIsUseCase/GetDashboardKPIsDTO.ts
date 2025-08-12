import { Municipality } from '../../../../domain/entities/municipality';
import { School } from '../../../../domain/entities/school';

export interface GetDashboardKPIsDTO {
  schools: number;
  schoolsWithHighInfraestructureRisk: number;
  municipalitiesWithMostAverageRisk: { idIbge: string; name: string; averageRisk: number; schoolsCount: number };
  lackName: string;
}
