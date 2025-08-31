import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from './dialog';
import { Info } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-[9999]" />

      <DialogContent className="sm:max-w-lg p-6 z-[9999] bg-white rounded-2xl shadow-lg">
        <DialogHeader className="flex flex-row justify-between items-center border-b pb-3">
          <div>
            <DialogTitle className="text-2xl font-bold text-brand-text-primary tracking-tight">
              Sobre o Observatório de Educação da Paraíba
            </DialogTitle>
            <p className="text-sm text-brand-orange-contrast italic mt-1">
              Dados, ciência e tecnologia a serviço da educação paraibana
            </p>
            <div className="w-12 h-1 bg-[#D46419] rounded-full mt-2"></div>
          </div>
        </DialogHeader>

        <div className="mt-6 text-base leading-relaxed text-brand-text-primary  space-y-4">
          <p>
            Este projeto é uma iniciativa conduzida por{' '}
            <span className="font-medium">
              estudantes do curso de Ciência de Dados para Negócios
            </span>{' '}
            da{' '}
            <span className="font-semibold">
              Universidade Federal da Paraíba (UFPB)
            </span>
            , em estreita colaboração com o professor e coordenador do{' '}
            <span className="font-medium">
              Laboratório de Estatística e Modelagem Aplicada (LEMA)
            </span>
            .
          </p>

          <p>
            Nosso objetivo é transformar{' '}
            <span className="font-semibold text-[#D46419]">dados públicos</span>{' '}
            em informações valiosas, oferecendo{' '}
            <span className="italic">insights acionáveis</span> que orientem
            políticas e estratégias para fortalecer a educação no estado.
          </p>

          <div className="p-4 bg-gray-50 border-l-4 border-[#D46419] rounded-lg shadow-sm flex items-start gap-2">
            <Info className="w-5 h-5 text-[#D46419] flex-shrink-0" />
            <p className="text-sm text-gray-700">
              O Observatório busca promover uma{' '}
              <span className="font-semibold">visão integrada</span> do cenário
              educacional, fomentando a <span className="italic">equidade</span>{' '}
              e auxiliando gestores, pesquisadores e a sociedade civil com dados
              acessíveis e confiáveis.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutModal;
