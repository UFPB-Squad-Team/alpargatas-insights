import { Bell, Settings, Menu as MenuIcon, HelpCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/components/common/dropdown-menu';
import { Button } from '../common/button';

interface MobileNavActionsProps {
  onNotificationsClick: () => void;
  onSettingsClick: () => void;
  onAboutClick: () => void;
}

export const MobileNavActions = ({
  onNotificationsClick,
  onSettingsClick,
  onAboutClick,
}: MobileNavActionsProps) => {
  return (
    <div className="sm:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={onNotificationsClick}
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span>Notificações</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={onSettingsClick}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={onAboutClick}
            className="flex items-center gap-2"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Ajuda & Sobre</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
