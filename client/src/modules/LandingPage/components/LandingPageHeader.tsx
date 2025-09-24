import { Button } from '@/ui/components/common/button';
import { Link } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';

export const LandingHeader = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 10);
  });

  return (
    <motion.header
      animate={{
        backgroundColor: isScrolled
          ? 'rgba(255, 255, 255, 0.8)'
          : 'rgba(255, 255, 255, 0)',
      }}
      transition={{ duration: 0.3 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-shadow',
        isScrolled && 'shadow-md backdrop-blur-sm border-b',
      )}
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <img
            className="w-12 h-12"
            src="/Logo de Educação e Análise de Dados.png"
            alt="Logo Observatório da Educação - PB"
          />
          <span className="font-bold text-brand-text-primary text-lg hidden sm:block">
            Observatório da Educação
          </span>
        </div>

        <Button asChild className='bg-brand-orange-contrast hover:bg-brand-orange-light'>
          <Link to="/dashboard">Acessar a Plataforma</Link>
        </Button>
      </div>
    </motion.header>
  );
};
