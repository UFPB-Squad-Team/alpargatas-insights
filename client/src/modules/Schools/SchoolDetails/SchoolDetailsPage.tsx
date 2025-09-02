import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@/ui/components/common/Spinner';
import { Button } from '@/ui/components/common/button';
import { ArrowLeft } from 'lucide-react';
import { getSchoolDetailsUseCase } from '@/shared/services/Schools/logic/getSchoolDetailsUseCase';
import { SchoolHeader } from './components/SchoolHeader';
import { ScoreGrid } from './components/SchoolGrid';
import { InfrastructureXRay } from './components/InfrastructureXRay';
import { MunicipalityContextCard } from './components/MunicipalityContextCard';

const SchoolDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: school,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['school-details', id],
    queryFn: () => getSchoolDetailsUseCase.execute(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (isError || !school) {
    return (
      <div className="text-center text-red-500 bg-white p-10 rounded-2xl shadow-sm border">
        <h2 className="text-xl font-bold">Ops!</h2>
        <p className="mt-2">
          Não foi possível carregar os detalhes da escola. Tente novamente mais
          tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Button variant="ghost" onClick={() => navigate('/escolas')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a lista de escolas
        </Button>
      </div>

      <SchoolHeader school={school} />

      <ScoreGrid
        riskScore={school.scoreDeRisco}
        contextualizedScore={school.scoreRiscoContextualizado}
        studentCount={school.totalAlunos}
      />

      <InfrastructureXRay infrastructure={school.infraestrutura} />

      <MunicipalityContextCard
        municipalityName={school.municipio}
        municipalityId={school.municipioId}
      />
    </div>
  );
};

export default SchoolDetailsPage;
