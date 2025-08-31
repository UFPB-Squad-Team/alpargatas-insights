import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import SettingsModal from './SettingsModal';
import { useClickOutside } from '@/ui/hooks/useClickOutside';
import AboutModal from '../common/AboutModal';

const Layout = () => {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const notificationsRef = useClickOutside(() => {
    setNotificationsOpen(false);
  });

  return (
    <div className="flex h-screen bg-brand-surface">
      <div className="transition-all duration-300 ease-in-out w-20 lg:w-64">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Navbar
          isNotificationsOpen={isNotificationsOpen}
          onNotificationsClick={() => setNotificationsOpen((prev) => !prev)}
          onSettingsClick={() => setSettingsOpen(true)}
          onAboutClick={() => setIsAboutOpen(true)}
          notificationsRef={notificationsRef}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
};

export default Layout;
