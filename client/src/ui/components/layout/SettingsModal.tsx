import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from '../common/dialog';
import FilterDropdown from '../common/FilterDropdown';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const languageOptions = [
    { value: 'pt', label: 'Português (Brasil)' },
    { value: 'en', label: 'English' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/50 z-[9999]" />
      <DialogContent className="sm:max-w-md w-full p-6 z-[9999] rounded-2xl shadow-lg bg-white dark:bg-gray-900">
        <DialogHeader className="flex flex-row justify-between items-center border-b pb-3">
          <DialogTitle className="text-lg font-semibold text-brand-text-primary">
            Configurações
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6 text-brand-text-primary">
          <p className="text-sm text-brand-text-secondary">
            Personalize sua experiência no Observatório de Educação da Paraíba.
            Essas configurações afetam apenas este dispositivo.
          </p>

          <section>
            <h3 className="text-base font-medium mb-2">Tema</h3>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-800 hover:bg-brand-orange-dark dark:hover:bg-gray-700">
                Claro
              </button>
              <button className="px-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-800 hover:bg-brand-orange-dark dark:hover:bg-gray-700">
                Escuro
              </button>
              <button className="px-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-800 hover:bg-brand-orange-dark dark:hover:bg-gray-700">
                Automático
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-base font-medium mb-2">Idioma</h3>
            <FilterDropdown
              label="Selecione o idioma"
              placeholder="Escolha um idioma"
              searchPlaceholder="Buscar idioma..."
              emptyText="Nenhum idioma encontrado"
              options={languageOptions}
              value="pt"
              onChange={(val) => console.log('Idioma:', val)}
            />
          </section>

          <section>
            <h3 className="text-base font-medium mb-2">Acessibilidade</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-orange-600" /> Alto
                  contraste
                </label>
              </li>
              <li>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-orange-600" />{' '}
                  Aumentar tamanho da fonte
                </label>
              </li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
