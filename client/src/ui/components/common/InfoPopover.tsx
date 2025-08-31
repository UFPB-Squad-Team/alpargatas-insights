import ReactMarkdown from 'react-markdown';
import { HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface InfoPopoverProps {
  title: string;
  content: string; 
}

const InfoPopover = ({ title, content }: InfoPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-brand-text-secondary hover:text-brand-orange-light transition-colors">
          <HelpCircle size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 z-[9999]">
        <div className="space-y-2">
          <h4 className="font-bold text-brand-text-primary">{title}</h4>
          <div className="prose prose-sm">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InfoPopover;
