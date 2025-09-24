import { cn } from '@/shared/lib/utils';
import {
  motion,
  useScroll,
  useTransform,
  Variants,
  useInView,
} from 'framer-motion';
import { Map, Microscope, BarChart3, ListChecks, Zap } from 'lucide-react';
import React, { useRef } from 'react';
import { Link } from 'react-router-dom'; // Novo import: Para Link do React Router (consistente com outros botões)

const DataParticlesBackground = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end center'], // Ajustado: Parallax mais suave, ativa no final da seção
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ y }}
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-brand-orange-dark/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
        />
      ))}
    </motion.div>
  );
};

const FeatureCard = ({
  className,
  icon: Icon,
  title,
  description,
  index,
  totalCards,
}: {
  className?: string;
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
  totalCards: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2, once: true });

  const variants: Variants = {
    hidden: { opacity: 0, scale: 0.9, rotateY: -10 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: i * 0.1, 
      },
    }),
    hover: {
      scale: 1.05,
      y: -10,
      boxShadow: '0 20px 40px rgba(212, 100, 25, 0.15)',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover="hover"
      custom={index}
      className={cn(
        'relative bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/30 shadow-xl overflow-hidden group',
        className,
      )}
    >
      {index < totalCards - 1 && (
        <motion.div
          className="absolute top-1/2 right-0 w-4 h-0.5 bg-gradient-to-r from-brand-orange-dark/20 to-transparent -translate-y-1/2"
          animate={{
            scaleX: ['0.5', '1', '0.5'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.5,
          }}
        />
      )}

      <motion.div
        className="p-4 bg-gradient-to-br from-brand-orange-light/30 to-brand-orange-dark/10 rounded-2xl w-fit mb-4 relative overflow-hidden"
        whileHover={{ scale: 1.1, rotate: 360 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-brand-orange-dark/10 to-transparent opacity-0 group-hover:opacity-100"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <Icon className="h-8 w-8 text-brand-orange-dark relative z-10" />
      </motion.div>

      <motion.h3
        className="font-bold text-xl text-brand-text-primary mb-2 relative"
        whileHover={{ color: '#D47A19' }} // Cor laranja no hover
      >
        {title}
        <motion.div
          className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange-dark"
          initial={{ width: 0 }}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        />
      </motion.h3>

      <motion.p
        className="text-base text-brand-text-secondary leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {description}
      </motion.p>

      <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-xs text-brand-text-secondary">Simule agora</span>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-brand-orange-dark/30 border-t-brand-orange-dark rounded-full"
        />
      </div>
    </motion.div>
  );
};

export const SolutionSection = () => {
  const containerRef = useRef(null);

  const features = [
    {
      icon: Map,
      title: 'Mapa Interativo de Vulnerabilidade',
      description:
        'Visualize todas as 3.768 escolas da Paraíba em um mapa georreferenciado, com cores indicando o nível de risco de infraestrutura. Clique para explorar dados em tempo real.',
      className: 'lg:col-span-2',
    },
    {
      icon: ListChecks,
      title: 'Análise Granular por Escola',
      description:
        'Acesse uma página de detalhes para cada escola, com um raio-x completo de sua infraestrutura e indicadores-chave. Filtre por município ou tipo de risco.',
      className: '',
    },
    {
      icon: BarChart3,
      title: 'Rankings e Diagnósticos',
      description:
        'Identifique os municípios mais vulneráveis e as deficiências de infraestrutura mais críticas em todo o estado. Gere relatórios personalizados com um clique.',
      className: '',
    },
    {
      icon: Microscope,
      title: 'Simulador de Impacto Estratégico',
      description:
        'Planeje investimentos de forma proativa, simulando o impacto de intervenções e descobrindo onde seus recursos podem fazer a maior diferença. Veja cenários em 3D.',
      className: 'lg:col-span-2',
    },
  ];

  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-white via-amber-50/50 to-white overflow-hidden">
      <DataParticlesBackground />
      <motion.div
        ref={containerRef}
        className="container mx-auto relative z-10"
      >
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, staggerChildren: 0.05 },
            },
          }}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-brand-text-primary to-brand-orange-dark bg-clip-text text-transparent tracking-tight"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
          >
            Apresentando o{' '}
            <motion.span
              className="inline-block"
              initial={{ scale: 0.9, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              Observatório
            </motion.span>
          </motion.h2>
          <motion.p
            className="mt-6 max-w-3xl mx-auto text-xl text-brand-text-secondary leading-relaxed"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            Uma suíte de ferramentas de inteligência de dados projetada para
            transformar a gestão educacional.
            <br />
            <span className="text-brand-orange-dark font-semibold">
              Inove com dados, impacte o futuro.
            </span>
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              index={index}
              totalCards={features.length}
            />
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link to="/dashboard">
            {' '}
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-brand-orange-dark to-brand-orange-contrast text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(212, 100, 25, 0.7)',
                  '0 0 0 20px rgba(212, 100, 25, 0)',
                  '0 0 0 0 rgba(212, 100, 25, 0.7)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="inline mr-2 h-5 w-5" />
              Comece a Explorar Agora
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};
