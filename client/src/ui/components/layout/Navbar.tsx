import { Bell, Settings, Menu as MenuIcon, HelpCircle } from 'lucide-react'; // Adicionamos o HelpCircle
import NotificationsDropdown from './NotificationsDropdown';
import React from 'react';
import SearchInput from '../common/SearchInput';

interface NavbarProps {
  isNotificationsOpen: boolean;
  onNotificationsClick: () => void;
  onSettingsClick: () => void;
  notificationsRef: React.RefObject<HTMLDivElement>;
}

const Navbar = ({
  isNotificationsOpen,
  onNotificationsClick,
  onSettingsClick,
  notificationsRef,
}: NavbarProps) => {
  return (
    <header className="relative flex items-center justify-between p-4 bg-brand-surface border-b rounded-xl border-gray-200 gap-4 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden text-brand-text-secondary">
          <MenuIcon className="h-6 w-6" />
        </button>
        <div className="hidden sm:flex items-center w-full max-w-md lg:max-w-xl xl:max-w-2xl">
          <SearchInput />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={onNotificationsClick}
            className="hidden sm:block relative text-brand-text-secondary hover:text-brand-accent transition-colors"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-brand-accent ring-2 ring-brand-surface" />
          </button>
          <NotificationsDropdown isOpen={isNotificationsOpen} />
        </div>

        <button
          onClick={onSettingsClick}
          className="hidden sm:block text-brand-text-secondary hover:text-brand-accent transition-colors"
        >
          <Settings className="h-6 w-6" />
        </button>

        <div className="hidden sm:block h-6 w-px bg-gray-200"></div>

        <button
          //TODO: onClick={() => { /* Lógica para abrir um modal "Sobre" no futuro */ }}
          className="hidden sm:flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition-colors"
        >
          <HelpCircle className="h-6 w-6" />
          <span className="font-medium text-sm hidden lg:block">
            Ajuda & Sobre
          </span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
