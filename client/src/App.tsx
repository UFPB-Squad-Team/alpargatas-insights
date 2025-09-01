import { Routes, Route } from 'react-router-dom';
import DashboardPage from './modules/Dashboard/DashboardPage';
import Layout from './ui/components/layout/Layout';
import { FiltersProvider } from './ui/context/FiltersContext';
import { DashboardProvider } from './ui/context/DashboardContext';
import SchoolsPage from './modules/Schools/SchoolsPage';
import { TooltipProvider } from './ui/components/common/tooltip';

function App() {
  return (
    <TooltipProvider>
      <FiltersProvider>
        <DashboardProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/escolas" element={<SchoolsPage />} />
              <Route path="/escolas/:id" />
            </Route>
          </Routes>
        </DashboardProvider>
      </FiltersProvider>
    </TooltipProvider>
  );
}

export default App;
