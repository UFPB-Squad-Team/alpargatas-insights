import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/components/common/dialog';
import { CheckCircle, MessageSquare, XCircle } from 'lucide-react';
import { FeedbackForm } from './FeedbackForm';
import { useMutation } from '@tanstack/react-query';
import { feedbackService } from '@/shared/services/Feedback/feedbackService';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FeedbackType } from '@/domain/entities/Feedback/FeedbackTypes';
import { Button } from '../button';

export const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const { mutate, isPending, isSuccess, isError, reset } = useMutation({
    mutationFn: feedbackService.create,
    onSuccess: () => {
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    },
    onSettled: () => {
      if (!isOpen) {
        reset();
      }
    },
  });

  const handleSubmit = (data: { message: string; type: FeedbackType }) => {
    mutate({ ...data, page: location.pathname });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => reset(), 500);
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-brand-orange-dark shadow-lg hover:bg-brand-orange-contrast transition-transform hover:scale-110"
          title="Enviar Feedback"
        >
          <MessageSquare />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Deixe seu feedback</DialogTitle>
          <DialogDescription>
            Encontrou um bug ou tem uma sugestão? Sua opinião é fundamental para
            a evolução desta plataforma.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center py-10 transition-opacity duration-500 animate-in fade-in">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-bold text-brand-text-primary">
              Obrigado!
            </h3>
            <p className="text-brand-text-secondary">
              Seu feedback foi enviado com sucesso.
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center text-center py-10 transition-opacity duration-500 animate-in fade-in">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-brand-text-primary">
              Ops! Algo deu errado.
            </h3>
            <p className="text-brand-text-secondary">
              Não foi possível enviar seu feedback. Tente novamente mais tarde.
            </p>
          </div>
        ) : (
          <FeedbackForm onSubmit={handleSubmit} isLoading={isPending} />
        )}
      </DialogContent>
    </Dialog>
  );
};
