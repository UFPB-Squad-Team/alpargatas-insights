import { cn } from '@/shared/lib/utils';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const Dot = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'w-1.5 h-1.5 bg-gray-200 rounded-full transition-colors duration-500',
      className,
    )}
  />
);

export const ProblemSection = () => {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  const text1Opacity = useTransform(
    scrollYProgress,
    [0.15, 0.25, 0.4, 0.5],
    [0, 1, 1, 0],
  );
  const text2Opacity = useTransform(
    scrollYProgress,
    [0.55, 0.65, 0.8, 0.9],
    [0, 1, 1, 0],
  );

  const highlightOpacity = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);

  const gridScale = useTransform(scrollYProgress, [0.1, 0.25], [0.8, 1]);
  const gridOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.25, 0.9, 0.95],
    [0, 1, 1, 0],
  );

  const dots = Array.from({ length: 800 }); // 40 colunas x 20 linhas
  const highlightIndices = [
    55, 150, 280, 310, 450, 580, 620, 750, 120, 490, 680, 220,
  ];

  return (
    <section ref={targetRef} className="relative h-[250vh] bg-white">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute z-10 w-full text-center px-4 max-w-4xl">
          <motion.div style={{ opacity: text1Opacity }}>
            <p className="text-3xl md:text-5xl font-bold text-brand-text-primary leading-tight">
              A Paraíba tem{' '}
              <span className="text-brand-orange-dark">3.768</span> escolas
              públicas.
            </p>
          </motion.div>
          <motion.div
            style={{ opacity: text2Opacity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <p className="text-3xl md:text-5xl font-bold text-brand-text-primary leading-tight">
              Como saber quais delas precisam de ajuda primeiro?
            </p>
          </motion.div>
        </div>

        <motion.div
          style={{ scale: gridScale, opacity: gridOpacity }}
          className="absolute inset-0 grid grid-cols-40 gap-2 p-10"
        >
          {dots.map((_, i) => {
            const isHighlight = highlightIndices.includes(i);

            // randoms diferentes pra cada bolinha
            const randomX = Math.random() * 4 - 2;
            const randomY = Math.random() * 4 - 2;
            const randomDelay = Math.random() * 3 + i * 0.002;

            return (
              <div key={i} className="relative">
                {isHighlight ? (
                  <motion.div
                    style={{ opacity: highlightOpacity }}
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      scale: [1, 2, 1], 
                      y: [0, randomY * 10, 0],
                      x: [0, randomX * 10, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      ease: 'easeInOut',
                      delay: randomDelay,
                    }}
                  >
                    <Dot className="bg-brand-orange-dark w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1], // sutis
                      y: [0, randomY * 5, 0],
                      x: [0, randomX * 5, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      ease: 'easeInOut',
                      delay: randomDelay,
                    }}
                  >
                    <Dot className="bg-gray-200 w-1.5 h-1.5" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
