import { Link } from 'react-router-dom';

export const LandingFooter = () => {
  return (
    <footer className="bg-brand-surface border-t border-gray-200">
      <div className="container mx-auto py-8 px-4 text-center text-brand-text-secondary">
        <div className="flex justify-center items-center gap-2 mb-2">
          <img
            className="w-10 h-10"
            src="/Logo de Educação e Análise de Dados.png"
            alt="Logo Observatório da Educação - PB"
          />
          <span className="font-bold text-brand-text-primary">
            Observatório da Educação - PB
          </span>
        </div>
        <p className="text-xs mt-4">
          © 2025 UFPB. Todos os direitos reservados.
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <Link
            to="/#"
            className="text-xs hover:text-brand-orange-dark transition-colors"
          >
            Metodologia
          </Link>
          <span className="text-xs">|</span>
          <Link
            to="/#"
            className="text-xs hover:text-brand-orange-dark transition-colors"
          >
            Contato
          </Link>
        </div>
      </div>
    </footer>
  );
};
