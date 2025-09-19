import { Button } from '@/ui/components/common/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/components/common/dialog';
import { NeedSubmissionForm } from './NeedSubmissionForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { CheckCircle, PlusCircle, XCircle } from 'lucide-react';
import { createNeedUseCase } from '../services/needService.ts/logic/createNeedsUseCase';

export const SubmitNeedDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, isError, reset } = useMutation({
    mutationFn: createNeedUseCase.execute,
    onSuccess: () => {
      // Quando uma necessidade é criada com sucesso, invalidamos a query da lista
      // para que o mural se atualize com os novos dados quando for recarregado.
      queryClient.invalidateQueries({ queryKey: ['needs-list'] });
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    },
  });

  const handleSubmit = (
    data: Parameters<typeof createNeedUseCase.execute>[0],
  ) => {
    mutate(data);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Adiciona um pequeno delay para a animação de fechar acontecer antes de resetar
      setTimeout(() => reset(), 300);
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-brand-orange-dark hover:bg-brand-orange-contrast">
          <PlusCircle className="mr-2 h-4 w-4" />
          Relatar uma Necessidade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Relatar uma Nova Necessidade
          </DialogTitle>
          <DialogDescription>
            Sua contribuição é fundamental. Descreva a necessidade que você
            identificou e, após uma breve moderação, ela aparecerá em nosso
            mural.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-bold text-brand-text-primary">
              Obrigado!
            </h3>
            <p className="text-brand-text-secondary">
              Sua contribuição foi enviada para análise.
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-brand-text-primary">
              Ops! Algo deu errado.
            </h3>
            <p className="text-brand-text-secondary">
              Não foi possível enviar seu relato. Tente novamente mais tarde.
            </p>
          </div>
        ) : (
          <NeedSubmissionForm onSubmit={handleSubmit} isLoading={isPending} />
        )}
      </DialogContent>
    </Dialog>
  );
};
