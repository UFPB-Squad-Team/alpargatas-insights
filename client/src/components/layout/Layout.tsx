import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-brand-surface ">
      <div
        className="
        transition-all duration-300 ease-in-out
        w-20 lg:w-64
      "
      >
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
