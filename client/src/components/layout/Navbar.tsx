import { Bell, Settings, Menu as MenuIcon } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';
import React from 'react';
import SearchInput from '../common/SearchInput';

interface NavbarProps {
  isNotificationsOpen: boolean;
  onNotificationsClick: () => void;
  onSettingsClick: () => void;
  notificationsRef: React.RefObject<HTMLDivElement | null>;
}

const Navbar = ({
  isNotificationsOpen,
  onNotificationsClick,
  onSettingsClick,
  notificationsRef,
}: NavbarProps) => {
  return (
    <header className="relative flex items-center justify-between p-4 bg-brand-background border-b rounded-xl border-gray-200 gap-4 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <button className="sm:hidden text-brand-text-secondary">
          <MenuIcon className="h-6 w-6" />
        </button>
        <div className="hidden sm:flex items-center bg-brand-surface rounded-md p-2 w-full max-w-md lg:max-w-xl xl:max-w-2xl">
          <SearchInput />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={onNotificationsClick}
            className="hidden sm:block relative text-brand-text-secondary hover:text-brand-orange-light transition-colors"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          <NotificationsDropdown isOpen={isNotificationsOpen} />
        </div>

        <button
          onClick={onSettingsClick}
          className="hidden sm:block text-brand-text-secondary hover:text-brand-orange-light transition-colors"
        >
          <Settings className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-brand-orange-dark flex items-center justify-center text-white font-bold">
            B
          </div>
          <div className="hidden md:block">
            <p className="font-semibold text-sm text-brand-text-primary">
              Brenno Henrique {/* TODO: vai ser um component futuramente*/}
            </p>
            <p className="text-xs text-brand-text-secondary">
              Diretor Executivo {/* TODO: vai ser um component futuramente*/}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
