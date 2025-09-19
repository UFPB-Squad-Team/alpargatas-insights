import React from 'react';
import { Settings, HelpCircle } from 'lucide-react';

interface DesktopNavActionsProps {
  isNotificationsOpen: boolean;
  onNotificationsClick: () => void;
  onSettingsClick: () => void;
  onAboutClick: () => void;
  notificationsRef: React.RefObject<HTMLDivElement>;
}

export const DesktopNavActions = ({
  onSettingsClick,
  onAboutClick,
}: DesktopNavActionsProps) => {
  return (
    <div className="hidden sm:flex items-center gap-2 md:gap-6">
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
