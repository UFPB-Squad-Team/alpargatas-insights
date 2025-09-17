import { Microscope } from 'lucide-react';
import SimulatorSchoolSelection from './SimulatorSchoolSelection/SimulatorSchoolSelection';
import { SimulatorStrategicPlanner } from './SimulatorStrategicPlanner/components/SimulatorStrategicPlanner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/ui/components/common/tabs';

const SimulatorPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-brand-orange-light/20 rounded-lg">
          <Microscope className="h-8 w-8 text-brand-orange-dark" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">
            Simulador de{' '}
            <span className="text-brand-orange-dark">Impacto </span>
          </h1>
          <p className="text-brand-text-secondary mt-1">
            Analise cenários de investimento e planeje intervenções
            estratégicas.
          </p>
        </div>
      </div>

      <Tabs defaultValue="school-analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="school-analysis">Análise por Escola</TabsTrigger>
          <TabsTrigger value="strategic-planning">
            Planejamento Estratégico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="school-analysis" className="mt-6">
          <SimulatorSchoolSelection />
        </TabsContent>

        <TabsContent value="strategic-planning" className="mt-6">
          <SimulatorStrategicPlanner />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimulatorPage;
