import { Link } from 'react-router-dom';
import Menu from './Menu';
import { HelpCircle } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full p-4 bg-brand-background border-r border-gray-200 shadow-md">
      <div>
        <div className="flex items-center mb-8">
          <Link
            to={'/'}
            className="flex items-center justify-center lg:justify-start gap-2"
          >
            <img
              className="w-14 h-14 lg:w-15 lg:h-15"
              src="/Logo de Educação e Análise de Dados.png"
              alt="Logo"
            />
            <span className="hidden lg:block font-bold text-brand-text-primary text-xl">
              Observatório da{' '}
              <span className="text-brand-orange-dark text-md">
                Educação - PB
              </span>
            </span>
          </Link>
        </div>
      </div>

      <div className="flex-grow">
        <Menu />
      </div>

      <div>
        <div className="border-t border-gray-200 pt-4 flex flex-col items-center lg:items-start">
          <p className="text-xs text-brand-text-secondary hidden lg:block">
            © 2025 UFPB.
          </p>
          <Link to="/ajuda" className="lg:hidden">
            <HelpCircle className="h-5 w-5 text-brand-text-secondary" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
