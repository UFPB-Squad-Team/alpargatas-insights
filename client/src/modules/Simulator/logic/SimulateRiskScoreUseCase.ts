import { schoolRepository } from '@/shared/services/Schools/repositories/schoolRepository';

type SimulateRiskScoreParams = {
  schoolId: string;
  interventions: string[];
};

type SimulateRiskScoreResponse = {
  currentScore: number;
  simulatedScore: number;
  scoreReduction: number;
};

const execute = (
  params: SimulateRiskScoreParams,
): Promise<SimulateRiskScoreResponse> => {
  return schoolRepository.simulateRiskScore(params);
};

export const SimulateRiskScoreUseCase = {
  execute,
};
