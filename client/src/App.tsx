import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './features/dashboard/DashboardPage';

function App() {
  return (
    <Routes>
      {/* Todas as rotas aqui dentro usarão o Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        {/* Adicione outras páginas aqui no futuro */}
      </Route>
    </Routes>
  );
}

export default App;
