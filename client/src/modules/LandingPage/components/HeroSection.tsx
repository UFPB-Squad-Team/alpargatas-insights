import { Button } from '@/ui/components/common/button';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMemo, useRef, useEffect } from 'react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const NeuralEducationalInsightsBackground = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const mouseRef = useRef({ x: 50, y: 50 });

  const networkData = useMemo(() => {
    const numNeurons = 15;
    const neurons: {
      id: number;
      x: number;
      y: number;
      radius: number;
      connections: number[]; 
    }[] = Array.from({ length: numNeurons }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      radius: Math.random() * 2 + 1.5,
      connections: [],
    }));

    neurons.forEach((neuron, i) => {
      const numConnections = Math.floor(Math.random() * 3) + 2;
      const possibleConnections = Array.from({ length: numConnections }, () =>
        Math.floor(Math.random() * numNeurons)
      ).filter((connId) => connId !== i && !neuron.connections.includes(connId));
      neuron.connections = possibleConnections.slice(0, numConnections);
    });

    return { neurons };
  }, []);

  const { neurons } = networkData;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 100;
        mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * 100;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const morphVariants = {
    data: { d: 'M 0 8 L 16 8' },
    graph: { d: 'M 0 12 L 0 4 L 4 4 L 4 8 L 8 8 L 8 0 L 12 0 L 12 12 L 16 12 L 16 6' },
    book: { d: 'M 2 2 L 14 2 L 14 14 L 2 14 Z M 4 4 L 12 4 L 12 12 L 4 12 Z' },
    arrow: { d: 'M 0 8 L 12 8 L 9 5 M 12 8 L 9 11' },
  };

  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 50%, #fed7aa 100%)' }}
        animate={{
          background: [
            'linear-gradient(135deg, #ffffff 0%, #fff7ed 50%, #fed7aa 100%)',
            'linear-gradient(135deg, #fef3c7 0%, #ffedd5 50%, #fdba74 100%)',
            'linear-gradient(135deg, #ffffff 0%, #fff7ed 50%, #fed7aa 100%)',
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg ref={svgRef} className="w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Pattern para sinal fluindo nas linhas */}
          <defs>
            <pattern id="signal" width="10" height="4" patternUnits="userSpaceOnUse">
              <rect width="5" height="2" fill="rgba(212, 100, 25, 0.8)" />
            </pattern>
          </defs>
        </defs>

        {neurons.map((neuron, i) =>
          neuron.connections.map((connId) => {
            const target = neurons[connId];
            const distToMouse = getDistance(
              (neuron.x + target.x) / 2,
              (neuron.y + target.y) / 2,
              mouseRef.current.x,
              mouseRef.current.y
            );
            const isNearMouse = distToMouse < 15;
            const baseDelay = i * 0.1 + connId * 0.05;

            return (
              <motion.line
                key={`conn-${i}-${connId}`}
                x1={neuron.x}
                y1={neuron.y}
                x2={target.x}
                y2={target.y}
                stroke="rgba(212, 100, 25, 0.4)"
                strokeWidth={isNearMouse ? 2.5 : 1.2}
                strokeDasharray={isNearMouse ? "5,5" : "0"} 
                initial={{ pathLength: 0, opacity: 0.3 }}
                animate={{
                  pathLength: 1,
                  opacity: [0.3, 0.7, 0.3],
                  strokeDashoffset: isNearMouse ? [-10, 0] : 0,
                }}
                transition={{
                  duration: 6 + baseDelay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: baseDelay,
                }}
              />
            );
          })
        )}

        {neurons.map((neuron, i) => (
          <motion.g
            key={`neuron-${i}`}
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.9, 1.4, 0.9],
              filter: 'url(#glow)',
            }}
            transition={{
              duration: 5 + i * 0.2, 
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut',
            }}
          >
            <circle cx={neuron.x} cy={neuron.y} r={neuron.radius} fill="rgba(212, 100, 25, 0.8)" />
            <motion.circle
              cx={neuron.x}
              cy={neuron.y}
              r={neuron.radius * 0.6}
              fill="rgba(212, 100, 25, 0.5)"
              animate={{ scale: [0.6, 1.6, 0.6], opacity: [1, 0, 1] }}
              transition={{
                duration: 4, 
                repeat: Infinity,
                delay: i * 0.2 + 1.5,
                ease: 'easeInOut',
              }}
            />
          </motion.g>
        ))}

        {neurons.map((neuron, i) => (
          <motion.circle
            key={`wave-${i}`}
            cx={neuron.x}
            cy={neuron.y}
            r={0}
            fill="none"
            stroke="rgba(212, 100, 25, 0.3)"
            strokeWidth="1.5"
            animate={{
              r: [0, 8, 0],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 4, 
              repeat: Infinity,
              repeatDelay: 4,
              delay: i * 0.2 + 2.5,
              ease: 'easeOut',
            }}
          />
        ))}

        
        {neurons.slice(0, 8).flatMap((neuron, i) => 
          neuron.connections.slice(0, 2).map((connId, j) => { 
            const target = neurons[connId];
            return (
              <motion.circle
                key={`particle-${i}-${j}`}
                cx={neuron.x}
                cy={neuron.y}
                r={1}
                fill="rgba(212, 100, 25, 1)"
                initial={{ pathLength: 0 }}
                animate={{
                  cx: [neuron.x, target.x],
                  cy: [neuron.y, target.y],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 5 + j * 1.5, 
                  repeat: Infinity,
                  repeatDelay: 2,
                  delay: i * 0.15 + j * 0.7,
                  ease: 'easeInOut',
                }}
              />
            );
          })
        )}

        {neurons.slice(0, 5).map((neuron, i) => (
          <motion.g
            key={`morph-${i}`}
            transform={`translate(${neuron.x - 8} ${neuron.y - 8})`}
            initial="data"
            animate={['graph', 'book', 'arrow', 'data'][i % 4] as any}
            variants={morphVariants}
            transition={{
              duration: 5 + i * 0.4, 
              repeat: Infinity,
              repeatType: 'reverse',
              repeatDelay: 2,
              ease: 'easeInOut',
            }}
          >
            <path
              d="M 0 8 L 16 8"
              fill="none"
              stroke="rgba(212, 100, 25, 0.6)"
              strokeWidth="1.5"
            />
          </motion.g>
        ))}
      </svg>

      <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 100">
        <motion.rect
          x="5"
          y="85"
          width="90"
          height="8"
          fill="rgba(212, 100, 25, 0.4)"
          rx="4"
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
};

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Fundo impecável com rede neural conectada */}
      <NeuralEducationalInsightsBackground />

      <motion.div
        className="container mx-auto text-center z-10 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-brand-text-primary tracking-tight"
        >
          Transformando Dados em Futuro para a Educação na Paraíba
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-text-secondary"
        >
          A primeira plataforma de inteligência de dados abertos para análise e
          suporte à decisão na gestão da educação pública do estado.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-brand-orange-dark hover:bg-brand-orange-contrast text-lg h-12 px-8"
          >
            <Link to="/dashboard">Acessar a Plataforma</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-lg h-12 px-8"
          >
            <a href="#metodologia">Conheça a Metodologia</a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};
