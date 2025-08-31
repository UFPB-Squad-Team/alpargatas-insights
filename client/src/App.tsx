import { Routes, Route } from 'react-router-dom';
import DashboardPage from './modules/Dashboard/DashboardPage';
import Layout from './ui/components/layout/Layout';
import { FiltersProvider } from './ui/context/FiltersContext';
import { DashboardProvider } from './ui/context/DashboardContext';

function App() {
  return (
    <FiltersProvider>
      <DashboardProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/escolas" />
          </Route>
        </Routes>
      </DashboardProvider>
    </FiltersProvider>
  );
}

export default App;
