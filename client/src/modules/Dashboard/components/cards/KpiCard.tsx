import InfoPopover from '@/ui/components/common/InfoPopover';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  icon_secondary?: LucideIcon;
  description: string;
  info?: { title: string; content: string };
}

const KpiCard = ({
  title,
  value,
  icon: Icon,
  description,
  icon_secondary: IconSecondary,
  info,
}: KpiCardProps) => {
  return (
    <div className="bg-brand-background p-6 rounded-2xl shadow-sm border border-gray-200 flex-1 min-w-[200px] flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-brand-text-primary flex items-center gap-2 flex-wrap">
            <span className="break-words">{title}</span>
            {info && <InfoPopover title={info.title} content={info.content} />}
          </h3>

          <div className="bg-brand-orange-light p-2 rounded-lg ml-2 flex-shrink-0">
            <Icon className="h-6 w-6 text-brand-orange-dark" />
          </div>
        </div>

        <p className="text-2xl lg:text-3xl font-bold text-brand-text-primary my-2 break-words capitalize">
          {value}{' '}
          {IconSecondary && (
            <IconSecondary className="inline-block ml-2 h-6 w-6 text-brand-orange-contrast" />
          )}
        </p>
      </div>

      <p className="text-xs text-brand-text-secondary mt-auto">{description}</p>
    </div>
  );
};

export default KpiCard;
