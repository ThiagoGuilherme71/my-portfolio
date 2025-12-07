import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useInView, AnimatePresence } from 'framer-motion';

// --- ASSETS & UTILS ---

// Textura de granulação para dar aspecto de ilustração/papel
const GrainTexture = () => (
  <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] mix-blend-overlay"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
  />
);

// Elementos decorativos ilustrativos (rabiscos)
const IllustrativeDecor = ({ variant = 'dots', className = '' }) => {
  const shapes = {
    dots: (
      <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="5" cy="5" r="3" fill="currentColor" className="text-amber-400/60"/>
        <circle cx="25" cy="8" r="2" fill="currentColor" className="text-orange-500/60"/>
        <circle cx="45" cy="4" r="4" fill="currentColor" className="text-yellow-500/60"/>
        <circle cx="15" cy="20" r="2" fill="currentColor" className="text-amber-400/60"/>
        <circle cx="35" cy="22" r="3" fill="currentColor" className="text-orange-500/60"/>
      </svg>
    ),
    squiggle: (
      <svg width="80" height="20" viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M2 10C10 18 20 2 30 10C40 18 50 2 60 10C70 18 78 5 78 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-amber-500/40" />
      </svg>
    )
  };
  return shapes[variant];
};

// Ícones SVG otimizados (Mantidos da V1)
const Icons = {
  Code2: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>),
  Palette: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>),
  Database: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>),
  Wrench: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>),
  Mail: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>),
  Linkedin: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>),
  Github: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>),
  MessageCircle: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>),
  MapPin: () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>),
  Sparkles: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>),
  Zap: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>),
  Award: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>),
  ExternalLink: () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>)
};

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'sobre', 'experiência', 'projetos', 'skills', 'contato'];
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Ajuste fino para detecção
          return rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const data = {
    skills: {
      backend: [
        { name: 'PHP', level: 80, color: 'from-indigo-500 to-indigo-600' },
        { name: 'Laravel', level: 82, color: 'from-rose-500 to-rose-600' },
        { name: 'Java', level: 60, color: 'from-orange-500 to-orange-600' },
        { name: 'Spring Boot', level: 40, color: 'from-emerald-500 to-emerald-600' },
        { name: 'API REST', level: 75, color: 'from-sky-500 to-sky-600' },
      ],
      frontend: [
        { name: 'JavaScript', level: 75, color: 'from-amber-400 to-amber-500' },
        { name: 'React', level: 40, color: 'from-cyan-500 to-cyan-600' },
        { name: 'HTML5', level: 95, color: 'from-orange-500 to-orange-600' },
        { name: 'CSS3', level: 90, color: 'from-blue-500 to-blue-600' },
        { name: 'TailwindCSS', level: 70, color: 'from-teal-500 to-teal-600' },
        { name: 'Bootstrap', level: 75, color: 'from-purple-500 to-purple-600' },
        { name: 'React Native', level: 25, color: 'from-indigo-500 to-indigo-600' }
      ],
      database: [
        { name: 'MySQL', level: 85, color: 'from-blue-500 to-blue-600' },
        { name: 'Oracle', level: 70, color: 'from-red-500 to-red-600' },
        { name: 'PostgreSQL', level: 76, color: 'from-blue-600 to-blue-700' },
        { name: 'Redis', level: 60, color: 'from-red-600 to-red-700' },
        { name: 'Firebird', level: 70, color: 'from-orange-500 to-orange-600' },
        { name: 'NoSQL', level: 60, color: 'from-green-500 to-green-600' }
      ],
      tools: [
        { name: 'Git', level: 90, color: 'from-orange-500 to-orange-600' },
        { name: 'Docker', level: 70, color: 'from-blue-500 to-blue-600' },
        { name: 'AWS', level: 60, color: 'from-yellow-500 to-yellow-600' },
        { name: 'Linux', level: 75, color: 'from-gray-700 to-gray-800' },
        { name: 'Scrum', level: 70, color: 'from-blue-600 to-blue-700' },
        { name: 'CI/CD', level: 60, color: 'from-green-500 to-green-600' }
      ]
    },
    experience: [
      {
        title: 'Desenvolvedor de Software',
        company: 'JCompany TI',
        period: 'Jun/2025 - Atual',
        location: 'Salvador - BA',
        current: true,
        achievements: [
          'Desenvolvimento de aplicações SaaS, ERPs e CRMs com PHP 7+ e Laravel',
          'Integração de APIs REST e microserviços',
          'Projetos estratégicos com impacto direto na geração de receita',
          'AWS, Firebird e CI/CD'
        ]
      },
      {
        title: 'Estagiário PHP/Laravel',
        company: 'SEMGE',
        period: 'Mar/2024 - Jun/2025',
        location: 'Salvador - BA',
        achievements: [
          'Desenvolvimento do SysLog - redução de 45% em chamados',
          'Ferramentas de gestão municipal com Laravel',
          'MySQL, Oracle, APIs RESTful e Docker',
          'Metodologias ágeis em ambiente colaborativo'
        ]
      }
    ],
    projects: [
      {
        name: 'SGLoc',
        description: 'ERP completo para locadoras com gestão de frotas, contratos e pagamentos. App mobile para vistoria.',
        tech: ['Laravel', 'Integrações Financeiras', 'Firebird', 'Redis', 'API REST'],
        link: 'https://sgloc.com.br',
        highlight: 'Em Produção',
        color: 'from-blue-600 to-blue-700'
      },
      {
        name: 'SysLog',
        description: 'Sistema de monitoramento de logs para secretaria municipal. Dashboard em tempo real com relatórios detalhados.',
        tech: ['PHP 7', 'Laravel', 'MySQL', 'Docker', 'Bootstrap', 'Tailwind'],
        highlight: '45% menos chamados',
        color: 'from-purple-600 to-purple-700'
      },
      {
        name: 'ByLink Soluções',
        description: 'Sistema de vagas e recrutamento (white label) com área pública para candidatos e painel de gestão privado.',
        tech: ['Next.js', 'Python', 'Supabase', 'Postgres'],
        link: 'https://www.bylinksolucoes.com.br/',
        highlight: 'White label • Full-stack',
        color: 'from-emerald-600 to-emerald-700'
      }
    ]
  };

  return (
    // Fundo base mais rico e quente
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-50 text-stone-900 relative overflow-x-hidden font-sans">
      {/* Overlay de textura para efeito de ilustração/papel */}
      <GrainTexture />

      {/* Elementos decorativos de fundo mais orgânicos */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-gradient-to-br from-orange-400 via-red-400 to-amber-500 rounded-full blur-[100px] mix-blend-multiply"
        />
         <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -30, 0],
            opacity: [0.08, 0.15, 0.08]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-tr from-yellow-400 to-orange-300 rounded-full blur-[80px] mix-blend-multiply"
        />
      </div>

      {/* Progress bar */}
      <motion.div 
        style={{ scaleX }} 
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 origin-left z-50"
      />

      <Navbar activeSection={activeSection} />

      <main className="relative z-10">
        <HeroSection />
        <SobreSection />
        <ExperienceSection experience={data.experience} />
        <ProjectsSection projects={data.projects} />
        <SkillsSection skills={data.skills} />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}

function Navbar({ activeSection }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: 'hero', label: 'Início' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'experiência', label: 'Experiência' },
    { id: 'projetos', label: 'Projetos' },
    { id: 'skills', label: 'Skills' },
    { id: 'contato', label: 'Contato' }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled ? 'w-[90%] max-w-4xl' : 'w-[95%] max-w-6xl'
      }`}
    >
      <motion.div
        className={`bg-white/70 backdrop-blur-xl rounded-2xl border border-amber-100/50 px-6 py-3 transition-all ${
          isScrolled ? 'shadow-lg shadow-orange-900/5' : 'shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm rotate-3">
              TG
            </div>
            <span className="text-stone-800 font-bold tracking-tight hidden sm:block">
              Thiago Guilherme
            </span>
          </motion.div>

          <div className="hidden md:flex items-center bg-stone-50/50 p-1 rounded-xl ls">
            {menuItems.map((item) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? 'text-orange-800'
                    : 'text-stone-600 hover:text-orange-700'
                }`}
              >
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute inset-0 bg-white shadow-sm rounded-lg border border-orange-100"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </motion.a>
            ))}
          </div>
           {/* Menu Mobile Simplificado (Placeholder) */}
           <div className="md:hidden text-stone-600">Menu</div>
        </div>
      </motion.div>
    </motion.nav>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <section 
      id="hero"
      ref={ref} 
      className="min-h-screen flex items-center justify-center px-4 pt-20 pb-20 relative overflow-hidden"
    >
      {/* Imagem de fundo com tratamento mais quente e ilustrativo */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${import.meta.env.BASE_URL}imgportifolio.jpg")`,
            backgroundPosition: 'center 30%',
            filter: 'brightness(0.6) contrast(1.2) sepia(0.4) saturate(1.5)' // Filtro para dar tom quente/dourado
          }}
        />
        {/* Gradiente de sobreposição para misturar a imagem com o fundo */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-50 via-orange-900/60 to-amber-900/40 mix-blend-multiply" />
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-orange-800 font-bold text-sm mb-6 shadow-sm border border-orange-100/50"
            >
              <Icons.MapPin />
              <span>Salvador, Bahia • Brasil 🇧🇷</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-white drop-shadow-lg"
            >
              Thiago
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-amber-400 filter drop-shadow-md relative">
                Guilherme
                 <IllustrativeDecor variant="squiggle" className="absolute -bottom-4 right-0 w-32 h-auto opacity-60 text-yellow-300" />
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="space-y-4 mb-10"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-100 flex items-center gap-3">
                <Icons.Code2 className="text-orange-300" /> Software Developer
              </h2>
              
              <p className="text-lg text-amber-50/90 leading-relaxed max-w-lg font-medium drop-shadow">
                Transformando problemas reais em soluções tecnológicas robustas. Especialista em <strong className="text-yellow-300">PHP & Laravel</strong> com a criatividade e energia da Bahia.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="#projetos"
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-600/30 flex items-center gap-2"
              >
                Ver Projetos <Icons.Sparkles className="w-5 h-5 text-yellow-200" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="#contato"
                className="px-8 py-4 bg-white/90 backdrop-blur-sm text-orange-900 font-bold rounded-xl shadow-md border-2 border-amber-100 hover:bg-white transition-colors"
              >
                Entrar em Contato
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Cards Flutuantes (Stats) - Estilo mais orgânico */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:grid grid-cols-2 gap-6 auto-rows-fr"
          >
            {[
              { icon: 'Award', label: 'Experiência', value: '2+ anos', color: 'bg-blue-500' },
              { icon: 'Zap', label: 'Projetos', value: '10+', color: 'bg-purple-500' },
              { icon: 'Code2', label: 'Stack Principal', value: 'PHP / Laravel', color: 'bg-orange-500' },
              { icon: 'Sparkles', label: 'Foco', value: 'Resultados Reais', color: 'bg-green-500' }
            ].map((stat, i) => {
              const IconComponent = Icons[stat.icon];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, rotate: i % 2 === 0 ? -2 : 2 }}
                  animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1, type: "spring", bounce: 0.4 }}
                  whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 1 : -1 }}
                  className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-amber-100/50 flex flex-col justify-center hover:shadow-orange-200/40 transition-all"
                >
                  <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-md rotate-3`}>
                    <IconComponent />
                  </div>
                  <div className="text-2xl font-black text-stone-800 leading-tight">{stat.value}</div>
                  <div className="text-sm text-stone-600 font-bold">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Componente de Título de Seção Reutilizável com toque ilustrativo
const SectionTitle = ({ children, subtitle, isInView }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6 }}
    className="text-center mb-16 relative"
  >
    <h2 className="text-4xl sm:text-5xl font-black mb-4 text-stone-900 relative inline-block">
      {children}
      <IllustrativeDecor variant="dots" className="absolute -top-6 -right-8 w-16 h-auto opacity-70" />
    </h2>
    {subtitle && (
      <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: '80px' } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full mb-4"
        />
    )}
    <p className="text-lg text-stone-600 max-w-2xl mx-auto">{subtitle}</p>
  </motion.div>
);


function SobreSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="sobre" ref={ref} className="min-h-screen flex items-center justify-center px-4 py-32 relative z-10">
      <div className="max-w-5xl w-full">
        <SectionTitle isInView={isInView} subtitle="Um pouco mais sobre minha jornada e motivações.">
          Sobre Mim
        </SectionTitle>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Card principal com texto - Estilo "Papel" mais quente */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-[2rem] border border-orange-100 shadow-xl shadow-orange-100/50 relative overflow-hidden"
          >
             {/* Decoração de fundo do card */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-bl-[100px] pointer-events-none" />

            <div className="space-y-6 text-stone-700 text-lg leading-relaxed relative z-10">
              <p>
                Olá! Sou <strong className="text-orange-700 font-bold">Thiago Guilherme</strong>, desenvolvedor full-stack 
                apaixonado por resolver problemas. Minha base é em Salvador - BA, e trago a energia e a criatividade da minha terra para cada linha de código.
              </p>
              <p>
                Minha jornada começou em 2023, e hoje atuo na <strong className="text-stone-900 font-bold">JCompany TI</strong>, desenvolvendo aplicações SaaS complexas. Tenho orgulho de entregas como o <strong className="text-orange-700">SysLog</strong>, que gerou um impacto real de <strong className="text-green-700 font-bold">45% de redução em chamados</strong> de suporte.
              </p>
              <p>
                Sou formado em <strong className="text-stone-900 font-bold">Análise e Desenvolvimento de Sistemas</strong> pela UCSAL (Média 9.0), e estou sempre buscando a próxima tecnologia para dominar.
              </p>
            </div>
          </motion.div>

          {/* Sidebar de Stats - Estilo mais integrado */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col gap-5"
          >
            {[
              { label: 'Localização', value: 'Salvador - BA', icon: 'MapPin', color: 'bg-red-500', rotate: 2 },
              { label: 'Experiência', value: '2+ anos', icon: 'Award', color: 'bg-blue-500', rotate: -1 },
              { label: 'Foco Principal', value: 'PHP & Laravel', icon: 'Code2', color: 'bg-orange-500', rotate: 2 }
            ].map((item, i) => {
              const IconComponent = Icons[item.icon];
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03, rotate: 0 }}
                  className={`bg-white p-6 rounded-2xl border border-amber-100 shadow-md flex items-center gap-5 transition-all rotate-[${item.rotate}deg]`}
                >
                  <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center text-white shadow-sm rotate-3 flex-shrink-0`}>
                    <IconComponent />
                  </div>
                  <div>
                    <div className="text-xl font-black text-stone-800">{item.value}</div>
                    <div className="text-sm text-stone-600 font-bold">{item.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection({ experience }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experiência" ref={ref} className="min-h-screen flex items-center justify-center px-4 py-32 relative overflow-hidden z-10">
       {/* Background ilustrativo sutil (padrão de café) */}
       <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
      
      <div className="max-w-4xl w-full relative z-10">
        <SectionTitle isInView={isInView} subtitle="Minha trajetória profissional e acadêmica.">
          Trajetória
        </SectionTitle>

        <div className="relative pl-8 md:pl-0">
          {/* Timeline vertical */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-orange-200/60 -translate-x-1/2" />

          <div className="space-y-12 md:space-y-16">
            {experience.map((exp, index) => (
              <ExperienceCard key={index} exp={exp} index={index} isInView={isInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({ exp, index, isInView }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`relative flex flex-col md:flex-row gap-8 md:gap-0 items-center ${isEven ? '' : 'md:flex-row-reverse'}`}
    >
      {/* Timeline Dot Centrado */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-white border-4 border-orange-400 rounded-full items-center justify-center z-10 shadow-sm">
         <div className="w-3 h-3 bg-orange-500 rounded-full" />
      </div>
      
      {/* Conteúdo (Data) */}
      <div className={`w-full md:w-1/2 flex ${isEven ? 'md:justify-end md:pr-12' : 'md:justify-start md:pl-12'}`}>
          <div className="bg-white border border-orange-100 px-6 py-3 rounded-2xl shadow-sm inline-block">
            <span className="font-bold text-orange-700">{exp.period}</span>
            {exp.current && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Atual</span>}
          </div>
      </div>

      {/* Conteúdo (Card) */}
      <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-8 rounded-3xl border border-amber-100 shadow-lg shadow-orange-100/30 relative hover:border-orange-200 transition-all"
        >
          <h3 className="text-2xl font-bold text-stone-900 mb-1">{exp.title}</h3>
          <p className="text-lg text-orange-600 font-bold mb-4">{exp.company}</p>
          
          <ul className="space-y-3">
            {exp.achievements.map((achievement, i) => (
              <li key={i} className="flex items-start gap-3 text-stone-700 leading-relaxed">
                <Icons.Sparkles className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProjectsSection({ projects }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projetos" ref={ref} className="min-h-screen flex items-center justify-center px-4 py-32 bg-gradient-to-b from-transparent via-orange-50/50 to-transparent relative z-10">
      <div className="max-w-6xl w-full">
        <SectionTitle isInView={isInView} subtitle="Uma seleção dos meus principais trabalhos e estudos.">
          Projetos Recentes
        </SectionTitle>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, isInView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-[2rem] border border-orange-100 shadow-xl shadow-orange-100/40 overflow-hidden hover:shadow-orange-200/60 transition-all duration-300 flex flex-col"
    >
      {/* Header colorido com forma orgânica */}
      <div className={`h-32 bg-gradient-to-r ${project.color} relative p-6 flex flex-col justify-between overflow-hidden`}>
         <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('/noise.svg')]"></div>
         {/* Forma orgânica decorativa */}
         <svg className="absolute bottom-0 left-0 w-full text-white" viewBox="0 0 1440 320" fill="currentColor" preserveAspectRatio="none" height="60">
            <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>

        <div className="flex justify-between items-start relative z-10">
          <span className="inline-block bg-white/20 backdrop-blur-md text-white border border-white/30 px-3 py-1 rounded-full text-xs font-bold">
            {project.highlight}
          </span>
          {project.link && (
            <motion.a
              whileHover={{ scale: 1.1, rotate: 5 }}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/90 hover:text-white transition-colors bg-white/20 p-2 rounded-full"
            >
              <Icons.ExternalLink width="18" height="18"/>
            </motion.a>
          )}
        </div>
      </div>
      
      <div className="p-8 pt-4 flex flex-col flex-grow bg-white relative z-20">
        <h3 className="text-2xl font-black text-stone-900 mb-3 group-hover:text-orange-700 transition-colors">
          {project.name}
        </h3>

        <p className="text-stone-600 leading-relaxed mb-8 flex-grow">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tech.map((tech, i) => (
            <span
              key={i}
              className="text-xs bg-orange-50 text-orange-800 px-3 py-1.5 rounded-lg font-bold border border-orange-100/50"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SkillsSection({ skills }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState('backend');

  const categories = {
    backend: { icon: 'Code2', label: 'Backend' },
    frontend: { icon: 'Palette', label: 'Frontend' },
    database: { icon: 'Database', label: 'Database' },
    tools: { icon: 'Wrench', label: 'Tools' }
  };

  return (
    <section id="skills" ref={ref} className="min-h-screen flex items-center justify-center px-4 py-32 relative z-10">
      <div className="max-w-5xl w-full">
        <SectionTitle isInView={isInView} subtitle="Tecnologias e ferramentas que domino.">
          Skills & Ferramentas
        </SectionTitle>

        {/* Tabs estilo "Tags" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {Object.entries(categories).map(([key, cat]) => {
            const IconComponent = Icons[cat.icon];
            const isActive = activeCategory === key;
            return (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2 ${
                  isActive
                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-orange-300 hover:text-orange-600'
                }`}
              >
                <IconComponent />
                {cat.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Skills grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "backOut" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {skills[activeCategory].map((skill, i) => (
              <SkillCard key={skill.name} skill={skill} index={i} isInView={isInView} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function SkillCard({ skill, index, isInView }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white p-6 rounded-2xl border border-orange-100 shadow-md hover:shadow-lg transition-all"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-black text-stone-800 flex items-center gap-2">
          {/* Pequeno ponto colorido antes do nome */}
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${skill.color}`}></div>
          {skill.name}
        </span>
        <span className="text-sm font-bold text-stone-500 bg-stone-100 px-2 py-1 rounded-md">{skill.level}%</span>
      </div>

      {/* Barra de progresso com estilo mais orgânico/pintado */}
      <div className="relative h-4 bg-stone-100 rounded-full overflow-hidden border border-stone-200/50">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1.2, delay: index * 0.05 + 0.2, ease: "easeOut" }}
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${skill.color} rounded-full shadow-sm`}
        >
          {/* Brilho na barra */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/30 rounded-t-full"></div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const contacts = [
    { 
      icon: 'Mail', label: 'Email', value: 'thiagoguilherme.barbosaa@gmail.com',
      href: 'mailto:thiagoguilherme.barbosaa@gmail.com', color: 'bg-blue-500'
    },
    { 
      icon: 'Linkedin', label: 'LinkedIn', value: '/in/thiagoguilhermebarbosa',
      href: 'https://linkedin.com/in/thiagoguilhermebarbosa', color: 'bg-blue-600'
    },
    { 
      icon: 'Github', label: 'GitHub', value: '/ThiagoGuilherme71',
      href: 'https://github.com/ThiagoGuilherme71', color: 'bg-stone-800'
    },
    { 
      icon: 'MessageCircle', label: 'WhatsApp', value: '(71) 98694-9813',
      href: 'https://wa.me/5571986949813', color: 'bg-green-500'
    }
  ];

  return (
    <section id="contato" ref={ref} className="py-32 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        <SectionTitle isInView={isInView} subtitle="Vamos conversar sobre seu próximo projeto?">
          Contato
        </SectionTitle>

        <div className="grid sm:grid-cols-2 gap-6">
          {contacts.map((contact, i) => {
            const IconComponent = Icons[contact.icon];
            return (
              <motion.a
                key={i}
                href={contact.href}
                target={contact.href.startsWith('http') ? '_blank' : undefined}
                rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group bg-white p-6 rounded-3xl border border-orange-100 shadow-lg hover:shadow-xl hover:border-orange-300 transition-all flex items-center gap-6"
              >
                <div className={`w-16 h-16 ${contact.color} rounded-2xl flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-transform`}>
                  <IconComponent />
                </div>
                <div className="overflow-hidden">
                  <div className="text-lg font-black text-stone-800 mb-1 group-hover:text-orange-700 transition-colors">{contact.label}</div>
                  <div className="text-stone-600 font-medium truncate">{contact.value}</div>
                </div>
              </motion.a>
            );
          })}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-2xl font-black text-orange-800 flex items-center justify-center gap-2">
            <Icons.Zap className="text-yellow-500"/> Disponível para novos desafios!
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative bg-stone-900 text-white pt-20 pb-10 px-6 z-10 overflow-hidden">
       {/* Decoração de rodapé */}
       <IllustrativeDecor variant="squiggle" className="absolute top-10 left-10 w-40 h-auto opacity-20 text-white" />
       <IllustrativeDecor variant="dots" className="absolute bottom-10 right-10 w-20 h-auto opacity-20 text-white" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg rotate-3">
                TG
              </div>
              <span className="text-3xl font-black text-white tracking-tight">
                Thiago Guilherme
              </span>
            </div>
            <p className="text-stone-400 text-lg max-w-md leading-relaxed font-medium">
              Desenvolvedor full-stack focado em criar soluções digitais com excelência técnica e a energia da Bahia.
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
             <a href="#hero" className="group flex items-center gap-2 text-lg font-bold text-orange-400 hover:text-orange-300 transition-colors bg-stone-800 px-6 py-3 rounded-full">
                Voltar ao topo <span className="group-hover:-translate-y-1 transition-transform">↑</span>
             </a>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-stone-500 font-medium">
          <p>© {new Date().getFullYear()} Thiago Guilherme. Todos os direitos reservados.</p>
          <p className="flex items-center gap-2">
             Feito com <span className="text-red-500">❤</span> e Dendê em Salvador.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default App;