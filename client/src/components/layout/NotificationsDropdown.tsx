import { FileText, CheckCircle } from 'lucide-react';

interface NotificationsDropdownProps {
  isOpen: boolean;
}

const NotificationsDropdown = ({ isOpen }: NotificationsDropdownProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-20 border">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-brand-text-primary">Notificações</h3>
      </div>
      <div className="p-2 max-h-80 overflow-y-auto">
        {/* Notificação de Exemplo 1 */}
        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-brand-surface">
          <div className="text-blue-500 mt-1">
            <FileText size={20} />
          </div>
          <div>
            <p className="font-semibold text-sm text-brand-text-primary">
              Nova Análise Disponível
            </p>
            <p className="text-xs text-brand-text-secondary">
              O ETL processou os dados do último trimestre.
            </p>
          </div>
        </div>
        {/* Notificação de Exemplo 2 */}
        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-brand-surface">
          <div className="text-green-500 mt-1">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="font-semibold text-sm text-brand-text-primary">
              Deploy Concluído
            </p>
            <p className="text-xs text-brand-text-secondary">
              A versão 1.2.0 da plataforma está no ar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
