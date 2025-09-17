import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSchoolDetailsUseCase } from '@/shared/services/Schools/logic/getSchoolDetailsUseCase';
import { useState, useEffect } from 'react';
import { SimulatorControlPanel } from './components/SimulatorControlPanel';
import Spinner from '@/ui/components/common/Spinner';
import { SimulateRiskScoreUseCase } from '../logic/SimulateRiskScoreUseCase';
import { SchoolHeader } from '@/modules/Schools/SchoolDetails/components/SchoolHeader';
import { SimulatorResultsPanel } from './components/SimulatorResultsPanel';

const SimulatorDetailsPage = () => {
  const { id: schoolId } = useParams<{ id: string }>();
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>(
    [],
  );
  const [simulationResult, setSimulationResult] = useState<{
    currentScore: number;
    simulatedScore: number;
  } | null>(null);

  const { data: school, isLoading: isLoadingSchool } = useQuery({
    queryKey: ['school-details-for-simulator', schoolId],
    queryFn: () => getSchoolDetailsUseCase.execute(schoolId!),
    enabled: !!schoolId,
  });

  useEffect(() => {
    if (school) {
      setSimulationResult({
        currentScore: school.scoreDeRisco,
        simulatedScore: school.scoreDeRisco,
      });
    }
  }, [school]);

  const { mutate: runSimulation, isPending: isSimulating } = useMutation({
    mutationFn: SimulateRiskScoreUseCase.execute,
    onSuccess: (data) => {
      setSimulationResult({
        currentScore: data.currentScore,
        simulatedScore: data.simulatedScore,
      });
    },
  });

  useEffect(() => {
    if (schoolId) {
      runSimulation({ schoolId, interventions: selectedInterventions });
    }
  }, [selectedInterventions, schoolId, runSimulation]);

  const handleInterventionChange = (
    interventionKey: string,
    isSelected: boolean,
  ) => {
    setSelectedInterventions((prev) =>
      isSelected
        ? [...prev, interventionKey]
        : prev.filter((item) => item !== interventionKey),
    );
  };

  if (isLoadingSchool) {
    return (
      <div className="flex h-full w-full items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }
  if (!school) {
    return (
      <div className="text-center font-semibold text-lg text-brand-text-secondary py-20">
        Escola não encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SchoolHeader school={school} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* 2. A página agora renderiza nossos dois painéis superpoderosos */}
        <SimulatorControlPanel
          schoolInfra={school.infraestrutura}
          selectedInterventions={selectedInterventions}
          onInterventionChange={handleInterventionChange}
        />
        <SimulatorResultsPanel
          isSimulating={isSimulating}
          simulationResult={simulationResult}
        />
      </div>
    </div>
  );
};

export default SimulatorDetailsPage;
