import { cn } from '@/shared/lib/utils';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  Variants,
  easeOut,
  easeInOut,
} from 'framer-motion';
import { Button } from '@/ui/components/common/button';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';

const partners = [
  {
    name: 'Instituto Alpargatas',
    tagline: 'Parceiro Estratégico',
    logoUrl: '../../../../public/logo_no_background.svg',
    alt: 'Logo do Instituto Alpargatas',
    description:
      'O Instituto Alpargatas é uma organização social que investe na qualificação da educação pública e na promoção de oportunidades para crianças e jovens, atuando em parceria com comunidades e o poder público para gerar transformação social por meio do esporte e da cultura.',
    websiteUrl: 'https://www.institutoalpargatas.com.br/',
  },
];

const PartnershipBackground = () => {
  const ref = useRef<HTMLDivElement>(null);
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
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-brand-orange-dark/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            ease: easeInOut,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  );
};

const PartnerCard = ({ partner }: { partner: (typeof partners)[0] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: true });

  const variants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: easeOut },
    },
    hover: {
      scale: 1.02,
      y: -5,
      boxShadow: '0 20px 40px rgba(212, 100, 25, 0.1)',
      transition: { duration: 0.3, ease: easeOut },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover="hover"
      className={cn(
        'bg-white rounded-2xl shadow-xl border border-white/30 overflow-hidden group relative',
        'will-change-transform',
      )}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-brand-orange-light/5 to-transparent opacity-0 group-hover:opacity-100"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: easeOut }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 relative z-10">
        <motion.div
          className="p-8 flex items-center justify-center bg-gray-50 border-b md:border-b-0 md:border-r"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.8 }}
          transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
          whileHover={{ scale: 1.1 }}
        >
          <img
            src={partner.logoUrl}
            alt={partner.alt}
            className="max-h-24 transition-transform duration-500 group-hover:drop-shadow-lg"
          />
        </motion.div>

        <div className="md:col-span-2 p-8 space-y-4">
          <motion.p
            className="font-semibold text-brand-orange-dark text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 10 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}
            whileHover={{ color: '#D47A19', scale: 1.02 }}
          >
            {partner.tagline}
          </motion.p>

          <motion.p
            className="text-base text-brand-text-primary leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 10 }}
            transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
          >
            {partner.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 10 }}
            transition={{ duration: 0.5, delay: 0.4, ease: easeOut }}
          >
            <Button asChild variant="outline" className="relative group-btn">
              <a
                href={partner.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Saiba Mais
                <motion.div
                  className="ml-2 inline-flex"
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: easeInOut,
                  }}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </motion.div>
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export const PartnersSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative py-20 px-4 bg-brand-surface overflow-hidden">
      <PartnershipBackground />
      <div ref={containerRef} className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: easeOut }}
          className="text-center"
        >
          <motion.h2 className="text-3xl md:text-5xl font-bold text-brand-text-primary tracking-tight">
            Quem{' '}
            <motion.span
              className="inline-block"
              initial={{ scale: 0.95, rotate: -3 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              Acredita
            </motion.span>{' '}
            Neste Projeto
          </motion.h2>
        </motion.div>

        <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 gap-8">
          {partners.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
};
