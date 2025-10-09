export interface GetDashboardKPIsDTO {
  schools: number;
  schoolsWithHighInfraestructureRisk: number;
  municipalitiesWithMostAverageRisk: {
    idIbge: string;
    name: string;
    averageRisk: number;
    schoolsCount: number;
  };
  lackName: string;
}
