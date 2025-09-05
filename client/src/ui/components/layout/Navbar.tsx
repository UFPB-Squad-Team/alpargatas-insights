import React from 'react';
import SearchInput from '../common/SearchInput';
import { GlobalLoadingIndicator } from './GlobalLoadingIndicator';
import { DesktopNavActions } from './DesktopNavActions'; 
import { MobileNavActions } from './MobileNavActions';

interface NavbarProps {
  isNotificationsOpen: boolean;
  onNotificationsClick: () => void;
  onSettingsClick: () => void;
  onAboutClick: () => void;
  notificationsRef: React.RefObject<HTMLDivElement>;
}

const Navbar = (props: NavbarProps) => {
  return (
    <header className="relative flex items-center justify-between p-4 bg-brand-background border-b rounded-xl border-gray-200 gap-4 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <div className="hidden sm:flex items-center bg-brand-surface rounded-md p-2 w-full max-w-md lg:max-w-xl xl:max-w-2xl">
          <SearchInput />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <GlobalLoadingIndicator />

        <DesktopNavActions {...props} />
        <MobileNavActions {...props} />
      </div>
    </header>
  );
};

export default Navbar;
