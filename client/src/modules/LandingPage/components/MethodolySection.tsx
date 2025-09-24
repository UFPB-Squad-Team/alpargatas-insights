import { cn } from '@/shared/lib/utils'; 
import {
  motion,
  useScroll,
  useTransform,
  Variants,
  useInView,
} from 'framer-motion';
import { Database, ShieldAlert, BrainCircuit, ArrowRight } from 'lucide-react';
import React, { useRef } from 'react';
import { Button } from '@/ui/components/common/button';
import { Link } from 'react-router-dom';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const DataFlowBackground = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end center'], 
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ y }}
    >
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-8 bg-brand-orange-dark/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
          animate={{
            y: [0, -150, 0],
            opacity: [0.2, 0.8, 0.2],
            scaleY: [1, 1.2, 1],
          }}
          transition={{
            duration: 6 + Math.random() * 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.15,
          }}
        />
      ))}
    </motion.div>
  );
};

const MethodologyCard = ({
  icon: Icon,
  title,
  description,
  index,
  totalCards,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
  totalCards: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2, once: true }); 

  const variants: Variants = {
    hidden: { opacity: 0, scale: 0.95, rotateX: 10 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: i * 0.1,
      },
    }),
    hover: {
      scale: 1.05,
      y: -8,
      boxShadow: '0 15px 30px rgba(212, 100, 25, 0.1)',
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
        'relative bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white/30 shadow-lg overflow-hidden group',
        'flex flex-col items-center text-center',
      )}
    >
      {index < totalCards - 1 && (
        <motion.div
          className="absolute top-1/2 right-0 w-3 h-0.5 bg-gradient-to-r from-brand-orange-dark/15 to-transparent -translate-y-1/2"
          animate={{
            scaleX: ['0.6', '1', '0.6'],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.3,
          }}
        />
      )}

      <motion.div
        className="p-4 bg-gradient-to-br from-brand-orange-light/20 to-brand-orange-dark/5 rounded-full mb-4 relative overflow-hidden w-fit"
        whileHover={{ scale: 1.15, rotate: 180 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-brand-orange-dark/5 to-transparent opacity-0 group-hover:opacity-100"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <Icon className="h-8 w-8 text-brand-orange-dark relative z-10" />
      </motion.div>

      <motion.h3
        className="font-bold text-xl text-brand-text-primary mb-2 relative"
        whileHover={{ color: '#D47A19' }}
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
        className="text-brand-text-secondary mt-2 leading-relaxed"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {description}
      </motion.p>

      <div className="mt-4 pt-3 border-t border-white/20 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-3 h-3 border-2 border-brand-orange-dark/20 border-t-brand-orange-dark rounded-full"
        />
        <span className="text-xs text-brand-text-secondary ml-2">
          Em análise
        </span>
      </div>
    </motion.div>
  );
};

export const MethodologySection = () => {
  const containerRef = useRef(null); 

  const pillars = [
    {
      icon: Database,
      title: 'Fontes de Dados Abertos',
      description:
        'Utilizamos exclusivamente dados oficiais do INEP, como o Censo Escolar e o SAEB, garantindo a validade e a replicabilidade de nossas análises.',
    },
    {
      icon: ShieldAlert,
      title: 'Score de Risco baseado em Evidências',
      description:
        'Desenvolvemos um indicador pioneiro que mede a vulnerabilidade da infraestrutura escolar com base em evidências concretas e um índice de risco claro.',
    },
    {
      icon: BrainCircuit,
      title: 'Análise Avançada de Dados',
      description:
        'Analisamos por meio de random forest regression os fatores que mais impactam o desempenho escolar, permitindo intervenções mais eficazes.',
    },
  ];

  return (
    <section
      id="metodologia"
      className="relative py-20 px-4 bg-brand-background overflow-hidden"
    >
      <DataFlowBackground />
      <div ref={containerRef} className="container mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold text-brand-text-primary tracking-tight"
          >
            Construído sobre uma{' '}
            <motion.span
              className="inline-block"
              initial={{ scale: 0.95, rotate: -3 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              Base de Confiança
            </motion.span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-2xl mx-auto text-lg text-brand-text-secondary"
          >
            Nossa plataforma utiliza dados públicos e uma metodologia
            transparente para gerar insights confiáveis e acionáveis.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative"
        >
          {pillars.map((pillar, index) => (
            <MethodologyCard
              key={pillar.title}
              {...pillar}
              index={index}
              totalCards={pillars.length}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-lg h-12 px-8 relative overflow-hidden group"
          >
            <Link to="/metodologia">
              Leia a Metodologia Completa
              <motion.div
                className="ml-2 h-4 w-4 inline-flex"
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
