import { Link } from 'react-router-dom';
import Menu from './Menu';
import { HelpCircle, Lightbulb  } from 'lucide-react';

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
              className="w-14 h-14 lg:w-14 lg:h-14"
              src="/logo_no_background.svg"
              alt="Logo do Instituto Alpargatas"
            />
            <span className="hidden lg:block font-bold text-brand-text-primary text-xl">
              Alpargatas{' '}
              <span className="text-brand-orange-dark text-md">
                Insights
                <Lightbulb className="inline-block h-4 w-4 ml-1 text-brand-orange-dark" />
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
            © 2025 Alpargatas Insights.
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
