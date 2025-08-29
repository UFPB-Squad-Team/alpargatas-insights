import { Link } from 'react-router-dom';
import Menu from './Menu';
import { HelpCircle } from 'lucide-react';
import { branding } from '@/config/branding.config';

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full p-4 bg-brand-surface border-r border-gray-200 shadow-sm">
      <div className="mb-8">
        <Link
          to={'/'}
          className="flex items-center justify-center lg:justify-start gap-3" // Aumentado o gap para dar espaço
        >
          <img
            className="w-16 h-16 flex-shrink-0" // Tamanho fixo e evita que o ícone encolha
            src="/Logo de Educação e Análise de Dados.png" // Mantenha seu logo aqui
            alt="Logo do Observatório da Educação"
          />

          <div className="hidden lg:flex flex-col">
            <span className="font-bold text-brand-primary text-lg leading-tight">
              {branding.appName}
            </span>
            <span className="text-brand-accent-dark font-semibold text-sm leading-tight">
              {branding.appSubtitle}
            </span>
          </div>
        </Link>
      </div>

      <div className="flex-grow">
        <Menu />
      </div>

      <div className="border-t border-gray-200 pt-4 flex flex-col items-center lg:items-start">
        <p className="text-xs text-brand-text-muted hidden lg:block">
          © 2025 {branding.appOwner}
        </p>
        <Link to="/ajuda" className="lg:hidden">
          <HelpCircle className="h-5 w-5 text-brand-text-secondary" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
