export type RiskDistributionFromApi = {
  schoolsWithHighInfraestructureRisk: number;
  schoolsWithLowInfraestructureRisk: number;
  schoolsWithMediumInfraestructureRisk: number;
};

export type RiskDistribution = {
  faixa: string;
  quantidade: number;
  cor: string;
};

