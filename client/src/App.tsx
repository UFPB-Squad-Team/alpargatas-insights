import { Routes, Route } from 'react-router-dom';
import DashboardPage from './modules/Dashboard/DashboardPage';
import { DashboardProvider } from './ui/context/DashboardContext';
import Layout from './ui/components/layout/Layout';

function App() {
  return (
    <DashboardProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>
      </Routes>
    </DashboardProvider>
  );
}

export default App;
