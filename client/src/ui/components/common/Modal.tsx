import React from 'react';
import { X } from 'lucide-react';
import { useClickOutside } from '@/ui/hooks/useClickOutside';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const modalRef = useClickOutside(onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      {/* Container do Modal */}
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
        ref={modalRef}
      >
        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-semibold text-brand-text-primary">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-brand-text-secondary hover:text-brand-orange-light"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        {/* Conteúdo do Modal */}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
