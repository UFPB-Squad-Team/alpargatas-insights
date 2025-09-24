import { cn } from '@/shared/lib/utils';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/ui/components/common/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

export const CallToActionSection = () => {
  const containerRef = useRef(null);

  const AscendBackground = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ['start end', 'end center'],
    });
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

    return (
      <motion.div
        ref={ref}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ y }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-brand-orange-dark/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1.5}s`,
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.15,
            }}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <section className="relative py-20 px-4 bg-white overflow-hidden">
      <AscendBackground />
      <div
        ref={containerRef}
        className="container mx-auto text-center relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-6"
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-brand-text-primary tracking-tight"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            Pronto para{' '}
            <motion.span
              className="inline-block"
              initial={{ scale: 0.95, rotate: -2 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: 0.2,
              }}
            >
              transformar
            </motion.span>{' '}
            a gestão da educação na Paraíba?
          </motion.h2>

          <motion.p
            className="max-w-2xl mx-auto text-lg text-brand-text-secondary leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          >
            Acesse a plataforma, explore os dados e comece a tomar decisões
            baseadas em evidências hoje mesmo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
          >
            <motion.div
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
              style={{ display: 'inline-block' }}
            >
              <Button
                asChild
                size="lg"
                className={cn(
                  'mt-8 bg-brand-orange-dark hover:bg-brand-orange-contrast text-white text-lg h-14 px-10 relative overflow-hidden',
                  'will-change-transform',
                )}
              >
                <Link to="/dashboard">
                  Acesse o Observatório Agora
                  <motion.div
                    className="ml-2 inline-flex"
                    animate={{ x: [0, 6, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
