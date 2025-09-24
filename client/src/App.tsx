// src/App.tsx

import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './modules/Dashboard/DashboardPage';
import Layout from './ui/components/layout/Layout';
import { FiltersProvider } from './ui/context/FiltersContext';
import { DashboardProvider } from './ui/context/DashboardContext';
import SchoolsPage from './modules/Schools/SchoolsPage';
import { TooltipProvider } from './ui/components/common/tooltip';
import SchoolDetailsPage from './modules/Schools/SchoolDetails/SchoolDetailsPage';
import MunicipalityDetailsPage from './modules/Municipality/MunicipalityDetails/MunicipalityDetails';
import SimulatorDetailsPage from './modules/Simulator/SimulatorDetails/SimulatorDetailsPage';
import SimulatorPage from './modules/Simulator/SimulatorPage';
import NeedsPage from './modules/Needs/NeedsPage';
import LandingPage from './modules/LandingPage/LandingPage';
import MunicipalitiesPage from './modules/Municipality/MunicipalityPage';

function App() {
  return (
    <TooltipProvider>
      <FiltersProvider>
        <DashboardProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<DashboardPage />} />

              {/* CORREÇÃO APLICADA AQUI: rotas relativas, sem a barra inicial */}
              <Route path="escolas" element={<SchoolsPage />} />
              <Route path="escolas/:id" element={<SchoolDetailsPage />} />
              <Route path="municipios" element={<MunicipalitiesPage />} />
              <Route
                path="municipios/:id"
                element={<MunicipalityDetailsPage />}
              />
              <Route path="simulador" element={<SimulatorPage />} />
              <Route path="simulador/:id" element={<SimulatorDetailsPage />} />
              <Route path="necessidades" element={<NeedsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </DashboardProvider>
      </FiltersProvider>
    </TooltipProvider>
  );
}

export default App;
