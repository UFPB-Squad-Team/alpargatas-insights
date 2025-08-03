import Modal from '../common/Modal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configurações">
      <div>
        <p className="text-brand-text-secondary">
          Esta é a área de configurações. No futuro, poderemos adicionar opções
          como:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>Mudar tema (Claro/Escuro)</li>
          <li>Configurações de notificação</li>
          <li>Gerenciamento de perfil</li>
        </ul>
      </div>
    </Modal>
  );
};

export default SettingsModal;
