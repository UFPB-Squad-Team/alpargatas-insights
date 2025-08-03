import { Search, Bell, Settings, Menu as MenuIcon } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-brand-background border-b rounded-xl border-gray-200 gap-4">
      <div className="flex items-center gap-4 flex-1">
        {/* TODO: este botão pode controlar a visibilidade da sidebar em mobile */}
        <button className="sm:hidden text-brand-text-secondary">
          <MenuIcon className="h-6 w-6" />
        </button>

        <div className="hidden sm:flex items-center bg-brand-surface rounded-md p-2 w-full max-w-md lg:max-w-xl xl:max-w-2xl">
          <Search className="h-5 w-5 text-brand-text-secondary" />
          <input
            type="text"
            placeholder="Buscar escolas ou municípios..."
            className="bg-transparent ml-2 outline-none w-full text-brand-text-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <button className="hidden sm:block relative text-brand-text-secondary hover:text-brand-orange-light transition-colors">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <button className="hidden sm:block text-brand-text-secondary hover:text-brand-orange-light transition-colors">
          <Settings className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-brand-orange-dark flex items-center justify-center text-white font-bold">
            B
          </div>
          <div className="hidden md:block">
            <p className="font-semibold text-sm text-brand-text-primary">
              Brenno Henrique
            </p>
            <p className="text-xs text-brand-text-secondary">
              Diretor Executivo
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
