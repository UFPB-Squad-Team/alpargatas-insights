import { useState } from 'react';
import { Button } from '../button';
import { Label } from '../label';
import { RadioGroup, RadioGroupItem } from '../radio-group';
import { Textarea } from '../textarea';
import { Loader2 } from 'lucide-react';
import { FeedbackType } from '@/domain/entities/Feedback/FeedbackTypes';

interface FeedbackFormProps {
  onSubmit: (data: { message: string; type: FeedbackType }) => void;
  isLoading: boolean;
}

export const FeedbackForm = ({ onSubmit, isLoading }: FeedbackFormProps) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<FeedbackType>(FeedbackType.SUGGESTION);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length >= 10) {
      onSubmit({ message, type });
    }
  };

  const isSubmitDisabled = message.trim().length < 10 || isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div>
        <Label htmlFor="feedback-message">Sua Mensagem</Label>
        <Textarea
          id="feedback-message"
          placeholder="Digite seu feedback, sugestão ou relato de bug aqui... (mín. 10 caracteres)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Qual o tipo do seu feedback?</Label>
        <RadioGroup
          value={type}
          onValueChange={(value) => setType(value as FeedbackType)}
          className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={FeedbackType.SUGGESTION}
              id="type-suggestion"
              className="text-brand-orange-dark focus:ring-brand-orange-dark"
            />
            <Label htmlFor="type-suggestion">Sugestão</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={FeedbackType.BUG}
              id="type-bug"
              className="text-brand-orange-dark focus:ring-brand-orange-dark"
            />
            <Label htmlFor="type-bug">Bug</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={FeedbackType.PRAISE}
              id="type-praise"
              className="text-brand-orange-dark focus:ring-brand-orange-dark"
            />
            <Label htmlFor="type-praise">Elogio</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={FeedbackType.OTHER}
              id="type-other"
              className="text-brand-orange-dark focus:ring-brand-orange-dark"
            />
            <Label htmlFor="type-other">Outro</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSubmitDisabled}
          className="bg-brand-orange-dark hover:bg-brand-orange-contrast"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enviar Feedback
        </Button>
      </div>
    </form>
  );
};
