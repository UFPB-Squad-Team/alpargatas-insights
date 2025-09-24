import { cn } from '@/shared/lib/utils';
import {
  motion,
  useScroll,
  useTransform,
  Variants,
  useInView,
} from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';
import { useRef, useState } from 'react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }, // Reduzido pra mais fluido
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const teamMembers = [
  {
    name: 'Brenno Henrique',
    role: 'Engenheiro de Software & MLOps',
    imageUrl: 'https://placehold.co/400x400/FFF7ED/D46419?text=BH',
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Samuel Colaço',
    role: 'Engenheiro de Software & Cientista de Dados',
    imageUrl: 'https://placehold.co/400x400/FFF7ED/D46419?text=SC',
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Gustavo Henrique',
    role: 'Cientista de Dados & Analista de Dados',
    imageUrl: 'https://placehold.co/400x400/FFF7ED/D46419?text=GO',
    linkedin: '#',
    github: '#',
  },
];

const NetworkBackground = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end center'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '120%']);

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ y }}
    >
      {Array.from({ length: 8 }).map(
        (
          _,
          i, 
        ) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-brand-orange-dark/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 30 - 15, 0], 
              y: [0, Math.random() * 30 - 15, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.15,
            }}
          />
        ),
      )}
    </motion.div>
  );
};

const NetworkConnections = ({ active }: { active: boolean }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute w-20 h-0.5 bg-brand-orange-dark/20 rounded-full"
        style={{ top: '20%', left: '25%' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: active ? 1 : 0.5 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute w-20 h-0.5 bg-brand-orange-dark/20 rounded-full rotate-45"
        style={{ top: '50%', left: '50%' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: active ? 1 : 0.5 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute w-24 h-0.5 bg-brand-orange-dark/20 rounded-full -rotate-30"
        style={{ top: '70%', left: '10%' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: active ? 1 : 0.5 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }} 
      />
    </div>
  );
};

const TeamMemberCard = ({
  member,
  index,
  onHover,
  isActive,
}: {
  member: (typeof teamMembers)[0];
  index: number;
  onHover: (active: boolean) => void;
  isActive: boolean;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: true });

  const variants: Variants = {
    hidden: { opacity: 0, scale: 0.9, rotateY: 15 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.1 }, 
    }),
    hover: {
      scale: 1.03,
      y: -5,
      rotateY: -3,
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
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      className={cn(
        'relative bg-white rounded-2xl shadow-xl overflow-hidden group cursor-pointer',
        'will-change-transform', 
        isActive && 'ring-2 ring-brand-orange-dark/30',
      )}
      style={{ willChange: 'transform' }} // GPU acceleration
    >
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: inView ? 1 : 0, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
      >
        <img
          src={member.imageUrl}
          alt={`Foto de ${member.name}, ${member.role}`}
          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105" // Scale menor pra leveza
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-brand-orange-dark/10 to-transparent opacity-0 group-hover:opacity-100"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      <div className="p-6 bg-gray-50/80 backdrop-blur-sm relative">
        {' '}
        <motion.h3
          className="text-xl font-bold text-brand-text-primary mb-1" 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ scale: 1.02, color: '#D47A19' }} 
        >
          {member.name}
        </motion.h3>
        <motion.p
          className="text-sm text-brand-text-secondary opacity-90"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.15 }}
        >
          {member.role}
        </motion.p>
        <div className="flex items-center justify-end gap-3 mt-3">
          <motion.a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            title={`LinkedIn de ${member.name}`}
            className="text-gray-500 hover:text-brand-orange-dark transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }} 
            whileTap={{ scale: 0.9 }}
          >
            <Linkedin className="h-5 w-5" />
          </motion.a>
          <motion.a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            title={`GitHub de ${member.name}`}
            className="text-gray-500 hover:text-brand-orange-dark transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Github className="h-5 w-5" />
          </motion.a>
        </div>
        <motion.div
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Linkedin className="h-4 w-4 text-brand-orange-dark/50" />{' '}
        </motion.div>
      </div>
    </motion.div>
  );
};

export const TeamSection = () => {
  const [isNetworkActive, setIsNetworkActive] = useState(true); 
  const containerRef = useRef(null);

  return (
    <section className="relative py-20 px-4 bg-brand-surface overflow-hidden">
      <NetworkBackground />
      <div ref={containerRef} className="container mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
          className="text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold text-brand-text-primary tracking-tight"
          >
            Nossa{' '}
            <motion.span
              className="inline-block"
              initial={{ scale: 0.95, rotate: -3 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                duration: 0.4,
              }} 
            >
              Equipe
            </motion.span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-2xl mx-auto text-lg text-brand-text-secondary"
          >
            As mentes{' '}
            <span className="font-semibold text-brand-orange-dark">
              apaixonadas
            </span>{' '}
            por dados e educação que deram vida a este projeto.
          </motion.p>
        </motion.div>

        <div className="relative">
          <NetworkConnections active={isNetworkActive} />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
          >
            {teamMembers.map((member, index) => (
              <TeamMemberCard
                key={member.name}
                member={member}
                index={index}
                onHover={setIsNetworkActive}
                isActive={isNetworkActive}
              />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};
