import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  School,
  Map,
  Microscope,
  Settings,
  AlertCircle,
  FileText,
  Network,
} from 'lucide-react';
import React from 'react';

interface MenuItem {
  id: number;
  title: string;
  path: string;
  Icon: React.ElementType;
  group: string;
  disabled?: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    title: 'Dashboard',
    path: '/',
    Icon: LayoutDashboard,
    group: 'Análises',
  },
  {
    id: 2,
    title: 'Escolas',
    path: '/escolas',
    Icon: School,
    group: 'Análises',
    disabled: false,
  },
  {
    id: 3,
    title: 'Municípios',
    path: '/municipios',
    Icon: Map,
    group: 'Análises',
    disabled: true,
  },
  {
    id: 4,
    title: 'Simulador de Impacto',
    path: '/simulador',
    Icon: Microscope,
    group: 'Ferramentas',
    disabled: true,
  },
  {
    id: 5,
    title: 'Necessidades',
    path: '/necessidades',
    Icon: AlertCircle,
    group: 'Ferramentas',
    disabled: true,
  },
  {
    id: 6,
    title: 'Relatórios',
    path: '/relatorios',
    Icon: FileText,
    group: 'Ferramentas',
    disabled: true,
  },
  {
    id: 7,
    title: 'Ecossistema',
    path: '/ecossistema',
    Icon: Network,
    group: 'Avançado',
    disabled: true,
  },
  {
    id: 8,
    title: 'Configurações',
    path: '/configuracoes',
    Icon: Settings,
    group: 'Sistema',
    disabled: true,
  },
];

const Menu = () => {
  const { pathname } = useLocation();

  const groupedItems = menuItems.reduce(
    (acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>,
  );

  return (
    <nav className="flex flex-col gap-4">
      {Object.entries(groupedItems).map(([groupTitle, items]) => (
        <div key={groupTitle}>
          <span className="text-xs font-bold text-brand-text-secondary uppercase hidden lg:inline px-2 mb-2">
            {groupTitle}
          </span>
          <ul>
            {items.map((item) => {
              const isActive = pathname === item.path;

              return (
                <li key={item.id}>
                  {!item.disabled ? (
                    <Link
                      to={item.path}
                      className={`
                        p-2 flex items-center rounded-md my-1 transition-colors duration-200
                        ${
                          isActive
                            ? 'bg-brand-orange-dark text-white'
                            : 'text-brand-text-secondary hover:bg-brand-surface hover:text-brand-text-primary'
                        }
                      `}
                    >
                      <item.Icon className="h-5 w-5" />
                      <span className="hidden lg:inline ml-4">
                        {item.title}
                      </span>
                    </Link>
                  ) : (
                    <div className="p-2 flex items-center rounded-md my-1 text-gray-400 cursor-not-allowed">
                      <item.Icon className="h-5 w-5" />
                      <span className="hidden lg:inline ml-4">
                        {item.title}
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default Menu;
