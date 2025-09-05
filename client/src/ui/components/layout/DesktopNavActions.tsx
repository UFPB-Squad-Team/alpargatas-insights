import React from 'react';
import { Bell, Settings, HelpCircle } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';

interface DesktopNavActionsProps {
  isNotificationsOpen: boolean;
  onNotificationsClick: () => void;
  onSettingsClick: () => void;
  onAboutClick: () => void;
  notificationsRef: React.RefObject<HTMLDivElement>;
}

export const DesktopNavActions = ({
  isNotificationsOpen,
  onNotificationsClick,
  onSettingsClick,
  onAboutClick,
  notificationsRef,
}: DesktopNavActionsProps) => {
  return (
    <div className="hidden sm:flex items-center gap-2 md:gap-6">
      <div className="relative" ref={notificationsRef}>
        <button
          onClick={onNotificationsClick}
          className="relative text-brand-text-secondary hover:text-brand-orange-light transition-colors"
        >
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <NotificationsDropdown isOpen={isNotificationsOpen} />
      </div>

      <button
        onClick={onSettingsClick}
        className="text-brand-text-secondary hover:text-brand-orange-light transition-colors"
      >
        <Settings className="h-6 w-6" />
      </button>

      <div className="h-6 w-px bg-gray-200"></div>

      <button
        onClick={onAboutClick}
        className="flex items-center gap-2 text-brand-text-secondary hover:text-brand-orange-dark transition-colors"
      >
        <HelpCircle className="h-6 w-6" />
        <span className="font-medium text-sm hidden lg:block">
          Ajuda & Sobre
        </span>
      </button>
    </div>
  );
};
