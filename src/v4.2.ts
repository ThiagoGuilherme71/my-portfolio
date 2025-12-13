import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useInView, AnimatePresence } from 'framer-motion';

// --- ASSETS & UTILS ---

// Textura de granulação
const GrainTexture = () => (
  <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04] mix-blend-overlay"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
  />
);

// Elementos decorativos
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

const Icons = {
  Code2: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>),
  Palette: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>),
  Database: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>),
  Wrench: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>),
  Mail: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>),
  Linkedin: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>),
  Github: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>),
  MessageCircle: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>),
  MapPin: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>),
  Sparkles: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>),
  Zap: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>),
  Award: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>),
  ExternalLink: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>),
  Users: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  Coffee: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M18 2v2"/><path d="M3.6 10h14.4c1.7 0 3 1.3 3 3v2c0 3.3-2.7 6-6 6h-6c-3.3 0-6-2.7-6-6v-2c0-1.7 1.3-3 3-3Z"/><path d="M21 10v3a3 3 0 0 1-3 3h-3"/></svg>),
  X: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>),
  ChevronRight: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>),
  Download: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>)
};

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [hasModalOpen, setHasModalOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Desabilitar Tab quando modal está aberto
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (hasModalOpen && e.key === 'Tab') {
        e.preventDefault();
      }
    };
    
    if (hasModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasModalOpen]);

  // Controle de Seções Ativas
  useEffect(() => {
    const handleScroll = () => {
      if (hasModalOpen) return; // Não atualiza seção se modal estiver aberto
      
      const sections = ['hero', 'sobre', 'experiência', 'projetos', 'skills', 'contato'];
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Ajuste fino: Se o topo do elemento estiver no terço superior da tela
          return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 3;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasModalOpen]);

  const data = {
    skills: {
      backend: [
        { name: 'PHP', level: 85, color: 'from-orange-500 to-orange-600' },
        { name: 'Laravel', level: 85, color: 'from-amber-500 to-amber-600' },
        { name: 'Java', level: 65, color: 'from-yellow-500 to-yellow-600' },
        { name: 'Spring Boot', level: 40, color: 'from-orange-600 to-orange-700' },
        { name: 'API REST', level: 75, color: 'from-amber-600 to-orange-600' },
        { name: 'Python', level: 35, color: 'from-yellow-600 to-amber-600' },
      ],
      frontend: [
        { name: 'JavaScript', level: 70, color: 'from-cyan-400 to-cyan-500' },
        { name: 'React', level: 40, color: 'from-cyan-500 to-cyan-600' },
        { name: 'HTML5', level: 95, color: 'from-sky-500 to-sky-600' },
        { name: 'CSS3', level: 80, color: 'from-blue-500 to-blue-600' },
        { name: 'Vue.js', level: 60, color: 'from-cyan-600 to-cyan-700' },
        { name: 'TailwindCSS', level: 65, color: 'from-sky-400 to-sky-500' },
        { name: 'Bootstrap', level: 75, color: 'from-blue-600 to-blue-700' },
        { name: 'React Native', level: 25, color: 'from-cyan-500 to-sky-500' },
      ],
      database: [
        { name: 'MySQL', level: 85, color: 'from-emerald-500 to-emerald-600' },
        { name: 'Oracle', level: 70, color: 'from-teal-500 to-teal-600' },
        { name: 'PostgreSQL', level: 76, color: 'from-green-500 to-green-600' },
        { name: 'Redis', level: 60, color: 'from-emerald-600 to-emerald-700' },
        { name: 'Firebird', level: 80, color: 'from-teal-600 to-teal-700' },
      ],
      tools: [
        { name: 'Git', level: 90, color: 'from-purple-500 to-purple-600' },
        { name: 'Docker', level: 75, color: 'from-purple-600 to-purple-700' },
        { name: 'AWS', level: 60, color: 'from-violet-500 to-violet-600' },
        { name: 'Linux', level: 75, color: 'from-violet-600 to-violet-700' },
        { name: 'Scrum', level: 80, color: 'from-purple-500 to-violet-600' },
        { name: 'Metodologias Ágeis', level: 70, color: 'from-indigo-500 to-indigo-600' },
        { name: 'Postman', level: 75, color: 'from-purple-400 to-purple-500' },
        { name: 'Figma', level: 60, color: 'from-violet-400 to-violet-500' },
      ],
      soft: [
        { name: 'Comunicação', level: 75, color: 'from-pink-500 to-pink-600' },
        { name: 'Resolução de Problemas', level: 80, color: 'from-rose-500 to-rose-600' },
        { name: 'Gestão de Tempo', level: 75, color: 'from-pink-600 to-rose-600' },
        { name: 'Adaptabilidade', level: 80, color: 'from-fuchsia-500 to-pink-500' },
        { name: 'Liderança', level: 65, color: 'from-rose-600 to-rose-700' },
        { name: 'Pensamento Crítico', level: 70, color: 'from-pink-400 to-pink-500' },
        { name: 'Compartilhamento de Conhecimento', level: 80, color: 'from-fuchsia-600 to-fuchsia-700' },
        { name: 'Trabalho em Equipe ', level: 90, color: 'from-rose-400 to-rose-500' }
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
        ],
        details: {
          intro: "Atuação como desenvolvedor Full Stack mantendo e evoluindo sistemas consolidados no mercado e criando novos serviços e projetos seguindo padrões como: Design Patterns, conceitos de UX/UI, TDD, e Clean Architecture, com foco em escalabilidade e manutenibilidade.",
          stack: "PHP, Laravel, Redis, Firebird, AWS, Docker, testes automatizados e manuais.",
          challenge: "Migração de sistemas legados para arquitetura web MVC sem interrupção do serviço para clientes ativos e integração complexas como plataformas Asaas, PJbank, Serasa e etc."
        }
      },
      {
        title: 'Estagiário PHP/Laravel',
        company: 'SEMGE',
        period: 'Mar/2024 - Jun/2025',
        location: 'Salvador - BA',
        achievements: [
          'Desenvolvimento do SysLog - redução de 45% em chamados',
          'Ferramentas de gestão municipal com Laravel',
          'MySQL, Oracle, APIs RESTful, Docker',
          'Metodologias ágeis em ambiente colaborativo'
        ],
        details: {
          intro: "Atuação como estagiário de desenvolvimento, focado na otimização de processos internos da Secretaria Municipal e na criação de ferramentas que apoiam servidores na gestão da cidade. Atuei com Laravel, PHP, Docker, Oracle e Git/Gitlab, sempre em um ambiente dinâmico guiado pelo Scrum.",
          stack: "PHP 8+, Laravel, Bootstrap, Oracle DB, Docker,Git & GitLab, Scrum.",
          challenge: "Criar um sistema de logs centralizado (SysLog) que fosse intuitivo para funcionários técnicos e não-técnicos, resultando em diminuição de tickets de suporte."
        }
      },
      {
        title: 'Graduação em Análise e Desenvolvimento de Sistemas',
        company: 'Universidade Católica do Salvador (UCSAL)',
        period: 'Jan/2023 - Jun/2025',
        location: 'Salvador - BA',
        isAcademic: true,
        achievements: [
          'Formação completa em Análise e Desenvolvimento de Sistemas',
          'Participação em 2 Maratonas de Programação ICPC',
          'Projetos práticos com foco em resolução de problemas reais',
          'Fundamentos sólidos em estruturas de dados, algoritmos e engenharia de software'
        ],
        details: {
          intro: "Graduação focada em desenvolvimento de soluções tecnológicas, com base sólida em lógica de programação, estruturas de dados, algoritmos, banco de dados e engenharia de software. A formação me preparou para atuar com autonomia e criatividade na resolução de problemas complexos.",
          stack: "Java, Python, JavaScript, SQL, Git, metodologias ágeis, análise de sistemas, requisitos de software, padrões de projeto, clean code, clean architecture, raciocínio lógico.",
          challenge: "TCC: Desenvolvimento de uma plataforma mobile integrada com Inteligência Artificial para moderação de conteúdo nas redes sociais. A solução permite a remoção instantânea de comentários tóxicos em postagens, visando a saúde mental e a segurança digital dos usuários. O projeto de TCC foi aprovado com distinção (nota 10), recebendo reconhecimento acadêmico pela relevância técnica e social."
        }
      }
    ],
    projects: [
      {
        name: 'ByLink Soluções',
        description: 'Sistema de vagas e recrutamento (white label) com área pública para candidatos e painel de gestão privado.',
        tech: ['Next.js', 'Python', 'Supabase', 'Postgres'],
        link: 'https://www.bylinksolucoes.com.br/',
        highlight: 'White label • Em Produção',
        color: 'from-blue-300 to-purple-400',
        image: 'imgbylink.png',
        gallery: ['imgbylink.png', 'bylink02.png', 'bylink03.png']
      },
      {
        name: 'SysLog',
        description: 'Sistema de monitoramento de logs para secretaria municipal. Dashboard em tempo real com relatórios detalhados.',
        tech: ['PHP', 'Laravel', 'Oracle', 'Docker', 'Chart.js', 'API REST', 'Bootstrap', 'Tailwind', 'Telescope', 'Git', 'Docker '],
        highlight: '45% menos chamados • Privado',
        color: 'from-blue-200 to-blue-400',
        video: 'syslog-video.mov',
        image: 'syslog01.png',
        gallery: ['syslog01.png', 'syslog07.jpeg', 'syslog08.jpeg', 'syslog05.png']
      },
      {
        name: 'Gerenciador de Projetos',
        description: 'Gerenciador/Crud de projetos e tarefas. Principais desafios: implementar CI/CD com Docker + GitHub Actions, autenticação com JWT & publicação da imagem no Docker Hub .',
        tech: ['Laravel', 'PHP', 'SQLite', 'Deploy', 'Docker', 'CI/CD', 'GitHub Actions'],
        link: 'https://github.com/ThiagoGuilherme71/desafio-crud-projetos',
        highlight: 'Docker Hub • CI/CD',
        color: 'from-emerald-100 to-emerald-200',
        image: 'crud-projetos01.png',
        gallery: ['crud-projetos01.png', 'crud-projetos02.png', 'crud-projetos03.png', 'crud-projetos04.png']
      },
      {
        name: 'Jogo de Xadrez',
        description: 'Simulador completo de xadrez feito em Java proposto como desafio do curso do professor Nélio Alves. Inclui todas as regras oficiais do xadrez. Simulador via terminal.',
        tech: ['Java', 'Clean Code', 'SOLID', 'Lógica de programação'],
        link: 'https://github.com/ThiagoGuilherme71/chess-game-java',
        highlight: 'Lógica de Programação',
        color: 'from-red-300 to-red-400',
        image: 'chess-game.png',
        gallery: ['chess01.png', 'chess02.png',  'chess04.png', 'chess03.png'],
        // video: 'sample-video.mp4' // Exemplo de vídeo
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-50 text-stone-900 relative overflow-x-hidden font-sans">
      <GrainTexture />

      {/* Decorative Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-gradient-to-br from-orange-400 via-red-400 to-amber-500 rounded-full blur-[100px] mix-blend-multiply"
        />
         <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -30, 0], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-tr from-yellow-400 to-orange-300 rounded-full blur-[80px] mix-blend-multiply"
        />
      </div>

      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 origin-left z-50"/>

      <Navbar activeSection={activeSection} setShowPhotoModal={setShowPhotoModal} />
      
      {/* NOVA NAVEGAÇÃO ABSTRATA LATERAL */}
      <AbstractNav activeSection={activeSection} disabled={hasModalOpen} />

      <main className="relative z-10">
        <HeroSection />
        <SobreSection />
        <ExperienceSection experience={data.experience} setHasModalOpen={setHasModalOpen} />
        <ProjectsSection projects={data.projects} setHasModalOpen={setHasModalOpen} />
        <SkillsSection skills={data.skills} />
        <ContactSection />
      </main>

      <Footer />

      {/* Botão Flutuante de Contato */}
      <motion.a
        href="#contato"
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ 
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all group"
        title="Fale comigo"
      >
        <Icons.MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <div className="absolute inset-0 bg-orange-400 rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-opacity -z-10"></div>
      </motion.a>

      {showPhotoModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100]" 
          onClick={() => { setShowPhotoModal(false); setHasModalOpen(false); }}
          onAnimationStart={() => setHasModalOpen(true)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400 rounded-3xl blur-2xl opacity-40 scale-105"></div>
            <img 
              src={`${import.meta.env.BASE_URL}myphoto01.png`} 
              alt="Thiago Guilherme" 
              className="relative w-[21.6rem] h-[21.6rem] sm:w-[24rem] sm:h-[24rem] md:w-[28.8rem] md:h-[28.8rem] rounded-3xl object-cover shadow-2xl ring-4 ring-white/80 bg-white p-2"
              style={{ imageRendering: 'auto' }}
            />
            <button
              onClick={() => { setShowPhotoModal(false); setHasModalOpen(false); }}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-stone-600 hover:text-orange-600 hover:rotate-90 transition-all duration-300"
            >
              <Icons.X width="20" height="20" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// --- Componente de Navegação Abstrata ---
function AbstractNav({ activeSection, disabled }) {
  const sections = [
    { id: 'hero', label: 'Início' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'experiência', label: 'Exp.' },
    { id: 'projetos', label: 'Projetos' },
    { id: 'skills', label: 'Skills' },
    { id: 'contato', label: 'Contato' }
  ];

  if (disabled) return null;

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-6">
      {/* Linha "desenhada" conectando os pontos */}
      <div className="absolute top-0 bottom-0 w-px bg-stone-400/30 border-l border-dashed border-stone-400 left-1/2 -translate-x-1/2 -z-10" />
      
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <motion.a
            key={section.id}
            href={`#${section.id}`}
            className="relative group flex items-center justify-center w-6 h-6"
            whileHover={{ scale: 1.2 }}
          >
            {/* Tooltip ao passar o mouse */}
            <span className="absolute right-8 bg-stone-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {section.label}
            </span>

            {/* O Ponto (Dot) */}
            <motion.div
              animate={{
                width: isActive ? 16 : 8,
                height: isActive ? 16 : 8,
                backgroundColor: isActive ? '#f97316' : '#a8a29e', // orange-500 vs stone-400
                borderColor: isActive ? '#fff7ed' : 'transparent',
                borderWidth: isActive ? 2 : 0
              }}
              className="rounded-full shadow-sm"
            />
            
            {/* Efeito de "rabisco" ao redor quando ativo */}
            {isActive && (
              <motion.svg
                viewBox="0 0 24 24"
                className="absolute w-8 h-8 text-orange-500 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
              </motion.svg>
            )}
          </motion.a>
        );
      })}
    </div>
  );
}

function Navbar({ activeSection, setShowPhotoModal }) {
  const menuItems = [
    { id: 'hero', label: 'Início' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'experiência', label: 'Experiência' },
    { id: 'projetos', label: 'Projetos' },
    { id: 'skills', label: 'Skills' },
    { id: 'contato', label: 'Contato' },
    { id: 'curriculo', label: 'Currículo' }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl"
    >
      <motion.div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-amber-100/50 px-6 py-3 shadow-lg shadow-orange-900/5 flex items-center justify-between md:justify-between">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative" onClick={(e) => { e.stopPropagation(); setShowPhotoModal(true); }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl rotate-3 blur-sm opacity-30"></div>
              <img
                src={`${import.meta.env.BASE_URL}myphoto-preview.png`}
                alt="Thiago Guilherme"
                className="relative w-11 h-11 rounded-xl object-cover cursor-pointer shadow-lg rotate-3 ring-2 ring-white/90 bg-white p-0.5"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>
            <span 
              className="text-stone-800 font-bold tracking-tight cursor-pointer hover:text-orange-600 transition-colors"
              onClick={(e) => { e.stopPropagation(); setShowPhotoModal(true); }}
            >
              Thiago Guilherme
            </span>
          </motion.div>

          <div className="hidden md:flex items-center bg-stone-50/50 p-1 rounded-xl">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={item.id === 'curriculo' ? `${import.meta.env.BASE_URL}cv_thiago_guilherme.pdf` : `#${item.id}`}
                target={item.id === 'curriculo' ? '_blank' : undefined}
                rel={item.id === 'curriculo' ? 'noopener noreferrer' : undefined}
                className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeSection === item.id ? 'text-orange-800' : 'text-stone-600 hover:text-orange-700'}`}
              >
                {activeSection === item.id && (
                  <motion.div layoutId="activeSection" className="absolute inset-0 bg-white shadow-sm rounded-lg border border-orange-100" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            ))}
          </div>
      </motion.div>
    </motion.nav>
  );
}

// --- Seção Hero (Mantida similar, apenas ajustes finos) ---
function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  const stats = [
    { label: "PHP / Laravel", sub: "Stack Principal", icon: Icons.Code2, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "2+ Anos", sub: "Experiência no Mercado", icon: Icons.Award, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "45% Otimização", sub: "Case SysLog", icon: Icons.Zap, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "APIs & Microserviços", sub: "REST, Integrações, SaaS, CI/CD", icon: Icons.ExternalLink, color: "text-purple-600", bg: "bg-purple-50" }
  ];

  return (
    <section id="hero" ref={ref} className="min-h-screen flex items-center relative overflow-hidden bg-amber-50">
      
      {/* --- 1. BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center md:bg-right"
          style={{ 
            backgroundImage: `url("${import.meta.env.BASE_URL}imgportifolio.jpg")`, 
            backgroundPosition: '80% center', 
          }}
        />
        
        {/* --- 2. GRADIENTE AJUSTADO (15% menor na esquerda) --- */}
        {/* Mudança: Adicionei 'via-35%' (antes era padrão ~50%).
            Isso faz o creme sólido parar antes, revelando a imagem mais cedo.
        */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50 from-10% via-amber-50/65 via-28% to-transparent" />
        
        {/* Gradiente inferior suave para conectar com a próxima seção */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-50 to-transparent" />
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 relative z-10 pt-20 pb-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* --- COLUNA ESQUERDA: TEXTO --- */}
          <motion.div 
            className="lg:col-span-7 flex flex-col justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 self-start bg-white border border-orange-200 px-4 py-1.5 rounded-full text-stone-600 text-xs font-bold uppercase tracking-wide shadow-sm mb-8"
            >
              <Icons.MapPin className="w-3.5 h-3.5 text-orange-500" /> Salvador • Bahia 🇧🇷
            </motion.div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[1] text-stone-900 mb-6 tracking-tight">
              Thiago<br />
              <span className="text-orange-600 relative inline-block">
                Guilherme
                <svg className="absolute -bottom-2 w-full h-3 text-orange-300 opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>

            <h2 className="text-xl sm:text-2xl text-stone-600 font-medium mb-8 flex items-center gap-3">
              <span className="w-10 h-1 bg-orange-500 rounded-full"></span>
              Software Developer
            </h2>

            <p className="text-lg text-stone-600 leading-relaxed max-w-xl mb-10 font-medium">
              Resolver problemas do mundo real com tecnologia e criatividade é o que me impulsiona. <strong className="text-orange-700">Vamos melhorar o mundo juntos?!</strong>
            </p>

            <div className="flex gap-2 sm:gap-4">
              <motion.a 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                href="#projetos" 
                className="px-4 py-3 sm:px-8 sm:py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Ver Projetos</span>
                <span className="sm:hidden">Projetos</span>
                <Icons.ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.a>

              <motion.a 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                href="#contato" 
                className="px-4 py-3 sm:px-8 sm:py-4 bg-white/95 backdrop-blur-sm text-gray-700 hover:text-orange-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all border border-white/50 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Fale Comigo</span>
                <span className="sm:hidden">Contato</span>
              </motion.a>

              <motion.a 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                href={`${import.meta.env.BASE_URL}cv_thiago_guilherme.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 sm:px-8 sm:py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                <Icons.Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Currículo</span>
                <span className="sm:hidden">Currículo</span>
              </motion.a>
            </div>
          </motion.div>

          {/* --- COLUNA DIREITA: CARDS --- */}
          <motion.div 
            className="hidden lg:flex flex-col justify-center gap-5 lg:col-span-5 relative"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                whileHover={{ scale: 1.03, x: -5 }}
                className={`
                  relative 
                  ${index % 2 === 0 ? 'self-end mr-0' : 'self-end mr-12'} 
                  w-72 sm:w-80
                  bg-white/90 backdrop-blur-sm
                  border border-orange-100 
                  p-4 rounded-2xl 
                  shadow-xl shadow-orange-900/5
                  flex items-center gap-4
                  group cursor-default
                `}
              >
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>

                <div className="flex flex-col">
                  <span className="text-stone-800 font-black text-lg leading-tight">
                    {stat.label}
                  </span>
                  <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">
                    {stat.sub}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
const SectionTitle = ({ children, subtitle, isInView }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16 relative">
    <h2 className="text-4xl sm:text-5xl font-black mb-4 text-stone-900 relative inline-block">
      {children}
      <IllustrativeDecor variant="dots" className="absolute -top-6 -right-8 w-16 h-auto opacity-70" />
    </h2>
    {subtitle && (
      <motion.div initial={{ width: 0 }} animate={isInView ? { width: '80px' } : {}} className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full mb-4" />
    )}
    <p className="text-lg text-stone-600 max-w-2xl mx-auto">{subtitle}</p>
  </motion.div>
);

function SobreSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="sobre"
      ref={ref}
      className="min-h-screen flex items-center justify-center px-4 py-32 relative z-10"
    >
      <div className="max-w-5xl w-full">
        <SectionTitle
          isInView={isInView}
          subtitle="Um pouco mais sobre minha jornada e motivações."
        >
          Sobre Mim
        </SectionTitle>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* TEXTOS PRINCIPAIS */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-[2rem] border border-orange-100 shadow-xl shadow-orange-100/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-bl-[100px] pointer-events-none" />

            <div className="space-y-6 text-stone-700 text-lg leading-relaxed relative z-10">
              <p>
                Prazer! Me chamo{" "}
                <strong className="text-orange-700 font-bold">Thiago Guilherme</strong
                >, desenvolvedor full-stack motivado por transformar problemas reais
                em soluções eficientes. Nascido e criado em Salvador – BA, trago a
                criatividade e a energia da minha cidade para cada projeto, 
                combinando infraestrutura backend consistente com interfaces modernas e bem pensadas.
              </p>

              <p>
                Minha trajetória começou em 2023, nas primeiras aulas de lógica de
                programação. Hoje atuo como desenvolvedor júnior na{" "}
                <strong className="text-stone-900 font-bold">JCompany TI</strong>,
                construindo e aplicações SaaS, ERPs e APIs robustas. Entre minhas
                entregas, destaco o{" "}
                <strong className="text-orange-700">SysLog</strong>, que gerou uma
                redução real de{" "}
                <strong className="text-orange-700 font-bold">
                  45% em chamados 
                </strong>{" "} da Secretaria Municipal de Gestão (SEMGE).
                 Além da <strong className="text-blue-900 font-bold">implementação completa do módulo financeiro </strong> de um ERP,
                incluindo geração de boletos, cobranças, área white-label e histórico
                detalhado.
              </p>
            </div>
          </motion.div>

          {/* CARDS */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col gap-5"
          >
            {/* HARD SKILLS */}
            <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-md flex items-center gap-5 ">
              <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-sm  flex-shrink-0">
                <Icons.Code2 />
              </div>
              <div>
                <div className="text-xl font-black text-stone-800">Hard Skills</div>
                <div className="text-sm text-stone-600 font-bold">
                  PHP/Laravel, Javascript, Java/SpringBoot, PostgreSQL, Oracle, Firebird, Git e Docker. Foco em boas práticas, Clean Code
                  e padrões de projeto.
                </div>
              </div>
            </div>

            {/* SOFT SKILLS */}
            <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-md flex items-center gap-5 ">
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <Icons.Users />
              </div>
              <div>
                <div className="text-xl font-black text-stone-800">Soft Skills</div>
                <div className="text-sm text-stone-600 font-bold">
                  Aprender, ensinar e evoluir em conjunto. O conhecimento compartilhado
                  fortalece o time.
                </div>
              </div>
            </div>

            {/* VALORES */}
            <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-md flex items-center gap-5 ">
              <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <Icons.Award />
              </div>
              <div>
                <div className="text-xl font-black text-stone-800">Valores</div>
                <div className="text-sm text-stone-600 font-bold">
                  Compromisso, comunicação, clareza, disciplina e entusiasmo com novos
                  desafios.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

  );
}

// --- Seção Experiência com MODAL ---
function ExperienceSection({ experience, setHasModalOpen }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedExp, setSelectedExp] = useState(null);

  useEffect(() => {
    if (selectedExp) {
      document.body.style.overflow = 'hidden';
      setHasModalOpen(true);
    } else {
      document.body.style.overflow = 'unset';
      setHasModalOpen(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
      setHasModalOpen(false);
    };
  }, [selectedExp, setHasModalOpen]);

  return (
    <section id="experiência" ref={ref} className="min-h-screen flex items-center justify-center px-4 py-32 relative overflow-hidden z-10">
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
      
      <div className="max-w-4xl w-full relative z-10">
        <SectionTitle isInView={isInView} subtitle="Minha trajetória profissional e acadêmica.">Experiências</SectionTitle>
        <div className="relative pl-8 md:pl-0 space-y-12 md:space-y-16">
           <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-orange-200/60 -translate-x-1/2" />
            {experience.map((exp, index) => (
              <ExperienceCard key={index} exp={exp} index={index} isInView={isInView} onSelect={() => setSelectedExp(exp)} />
            ))}
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedExp && <ExperienceModal exp={selectedExp} onClose={() => setSelectedExp(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ExperienceCard({ exp, index, isInView, onSelect }) {
  const isEven = index % 2 === 0;
  const isAcademic = exp.isAcademic;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`relative flex flex-col md:flex-row gap-8 md:gap-0 items-center ${isEven ? '' : 'md:flex-row-reverse'}`}
    >
      <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-white border-4 ${isAcademic ? 'border-blue-400' : 'border-orange-400'} rounded-full items-center justify-center z-10 shadow-sm`}>
         <div className={`w-3 h-3 ${isAcademic ? 'bg-blue-500' : 'bg-orange-500'} rounded-full`} />
      </div>
      
      <div className={`w-full md:w-1/2 flex ${isEven ? 'md:justify-end md:pr-12' : 'md:justify-start md:pl-12'}`}>
          <div className={`bg-white border ${isAcademic ? 'border-blue-100' : 'border-orange-100'} px-6 py-3 rounded-2xl shadow-sm inline-block`}>
            <span className={`font-bold ${isAcademic ? 'text-blue-700' : 'text-orange-700'}`}>{exp.period}</span>
            {exp.current && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Atual</span>}
            {isAcademic && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">Acadêmico</span>}
          </div>
      </div>

      <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
        <motion.div
          whileHover={{ scale: 1.02, rotate: isEven ? 1 : -1 }}
          onClick={onSelect}
          className={`bg-white p-8 rounded-3xl border ${isAcademic ? 'border-blue-100 shadow-blue-100/30 hover:border-blue-300 hover:shadow-blue-200/50' : 'border-amber-100 shadow-orange-100/30 hover:border-orange-300 hover:shadow-orange-200/50'} shadow-lg relative transition-all cursor-pointer group`}
        >
          {/* Indicador de Clique */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className={`${isAcademic ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'} p-2 rounded-full`}><Icons.ExternalLink width={16} height={16} /></div>
          </div>

          <h3 className="text-2xl font-bold text-stone-900 mb-1">{exp.title}</h3>
          <p className={`text-lg ${isAcademic ? 'text-blue-600' : 'text-orange-600'} font-bold mb-4`}>{exp.company}</p>
          <ul className="space-y-3 mb-4">
            {exp.achievements.slice(0, 2).map((achievement, i) => (
              <li key={i} className="flex items-start gap-3 text-stone-700 leading-relaxed text-sm">
                <Icons.ChevronRight className={`w-4 h-4 ${isAcademic ? 'text-blue-500' : 'text-orange-500'} flex-shrink-0 mt-0.5`} />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
          <p className={`${isAcademic ? 'text-blue-500 group-hover:text-blue-700' : 'text-orange-500 group-hover:text-orange-700'} text-sm font-bold mt-4 underline decoration-dashed underline-offset-4`}>
             Clique para ver detalhes +
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
function ExperienceModal({ exp, onClose }) {
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl relative"
            >
                {/* Header do Modal */}
                <div className="bg-gradient-to-r from-stone-50 to-gray-100 p-8 border-b border-stone-200 relative">
                     <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-stone-200/50 hover:bg-stone-300/50 rounded-full transition-colors z-10">
                        <Icons.X className="text-stone-700" width="20" height="20" />
                     </button>
                     <h3 className="text-3xl font-black text-stone-900 mb-1 pr-16">{exp.title}</h3>
                     <p className="text-xl text-orange-600 font-bold pr-16">{exp.company} <span className="text-stone-500 font-normal text-base ml-2">• {exp.period}</span></p>
                </div>

                {/* Conteúdo do Modal */}
                <div className="p-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
                    {exp.details ? (
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-stone-800 mb-2 flex items-center gap-2"><Icons.Users className="w-5 h-5 text-orange-500" /> O Papel</h4>
                                <p className="text-lg text-stone-600 leading-relaxed">{exp.details.intro}</p>
                            </div>
                             <div>
                                <h4 className="font-bold text-stone-800 mb-2 flex items-center gap-2"><Icons.Zap className="w-5 h-5 text-yellow-500" /> Principal Desafio</h4>
                                <p className="text-lg text-stone-600 leading-relaxed">{exp.details.challenge}</p>
                            </div>
                             <div>
                                <h4 className="font-bold text-stone-800 mb-2 flex items-center gap-2"><Icons.Code2 className="w-5 h-5 text-blue-500" /> Stack Completa</h4>
                                <div className="text-lg bg-stone-50 p-4 rounded-xl text-stone-700 border border-stone-100 font-mono text-sm">
                                    {exp.details.stack}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                             {exp.achievements.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-stone-700 leading-relaxed">
                                    <Icons.ChevronRight className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                             ))}
                        </div>
                    )}
                </div>
                
                {/* <div className="p-6 border-t border-stone-100 bg-stone-50 text-center">
                    <button onClick={onClose} className="text-stone-500 font-bold hover:text-orange-600 transition-colors">Fechar Detalhes</button>
                </div> */}
            </motion.div>
        </motion.div>
    )
}

function ProjectsSection({ projects, setHasModalOpen }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (selectedProject) {
      setHasModalOpen(true);
    } else {
      setHasModalOpen(false);
    }
    return () => setHasModalOpen(false);
  }, [selectedProject, setHasModalOpen]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const carouselRef = useRef(null);
  const pauseTimeoutRef = useRef(null);

  // Autoplay quando a seção está visível
  useEffect(() => {
    if (!isInView || selectedProject || autoplayPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }, 4000); // Muda a cada 4 segundos

    return () => clearInterval(interval);
  }, [isInView, selectedProject, autoplayPaused, projects.length]);

  // Pausar autoplay temporariamente ao clicar nos botões
  const pauseAutoplay = () => {
    setAutoplayPaused(true);
    
    // Limpa timeout anterior se existir
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    // Reativa autoplay após 5 segundos
    pauseTimeoutRef.current = setTimeout(() => {
      setAutoplayPaused(false);
    }, 5000);
  };

  // Navegação do Carrossel
  const nextSlide = () => {
    pauseAutoplay();
    setCurrentSlide((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    pauseAutoplay();
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // Cleanup do timeout ao desmontar
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section id="projetos" ref={ref} className="min-h-screen flex items-center justify-center px-4 py-32 bg-gradient-to-b from-transparent via-orange-50/50 to-transparent relative z-10 overflow-hidden">
      <div className="max-w-7xl w-full">
        <SectionTitle isInView={isInView} subtitle="Uma seleção dos meus principais trabalhos e estudos.">Projetos Recentes</SectionTitle>
        
        {/* Carrossel Estiloso */}
        <div className="relative">
          {/* Navegação */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: "0 10px 30px rgba(249, 115, 22, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={prevSlide}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-lg hover:shadow-2xl transition-all text-3xl font-bold border-2 border-orange-400/50"
              >
                ‹
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: "0 10px 30px rgba(249, 115, 22, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={nextSlide}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-lg hover:shadow-2xl transition-all text-3xl font-bold border-2 border-orange-400/50"
              >
                ›
              </motion.button>
            </div>
            
            {/* Indicadores */}
            <div className="flex gap-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index ? 'w-8 bg-orange-500' : 'w-2 bg-orange-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Cards do Carrossel */}
          <div className="relative overflow-hidden">
            <motion.div
              ref={carouselRef}
              className="flex gap-8 select-none"
              animate={{ 
                x: window.innerWidth < 768 
                  ? `calc(-${currentSlide * 100}% - ${currentSlide * 32}px)` 
                  : `calc(-${currentSlide * 50}% - ${currentSlide * 16}px)` 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30
              }}
            >
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full md:w-[calc(50%-16px)] flex-shrink-0"
                >
                  <ProjectCard project={project} onOpen={() => setSelectedProject(project)} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal de Galeria */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

// Card Individual do Projeto
function ProjectCard({ project, onOpen }) {
  return (
    <div className="group bg-white rounded-[2rem] border border-orange-100 shadow-xl shadow-orange-100/40 overflow-hidden hover:shadow-orange-200/60 transition-all duration-300 flex flex-col h-full cursor-pointer" onClick={onOpen}>
      {/* Preview da Imagem */}
      <div className="relative h-72 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          src={`${import.meta.env.BASE_URL}${project.image}`}
          alt={project.name}
          className="w-full h-full object-cover pointer-events-none"
        />
        
        {/* Overlay com Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t ${project.color} opacity-60 group-hover:opacity-40 transition-opacity`} />
        
        {/* Badge e Link Externo */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <span className="inline-block bg-white/90 backdrop-blur-md text-stone-800 border border-white/30 px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
            {project.highlight}
          </span>
          {project.link && (
            <motion.a
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-white/90 backdrop-blur-md p-2.5 rounded-full text-orange-600 hover:text-orange-700 transition-colors shadow-md z-10"
            >
              <Icons.ExternalLink width="18" height="18" />
            </motion.a>
          )}
        </div>

        {/* Botão "Ver Mais" */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-full font-bold text-orange-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 pointer-events-auto"
          >
            Ver Galeria <Icons.ExternalLink width="14" height="14" />
          </motion.button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-black text-stone-900 mb-2 group-hover:text-orange-700 transition-colors">
          {project.name}
        </h3>
        <p className="text-stone-600 leading-relaxed mb-4 flex-grow text-sm">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tech.slice(0, 4).map((tech, i) => (
            <span
              key={i}
              className="text-xs bg-orange-50 text-orange-800 px-3 py-1.5 rounded-lg font-bold border border-orange-100/50"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="text-xs bg-stone-100 text-stone-600 px-3 py-1.5 rounded-lg font-bold">
              +{project.tech.length - 4}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Modal com Galeria
function ProjectModal({ project, onClose }) {
  const [currentMedia, setCurrentMedia] = useState(0);
  const hasVideo = !!project.video;
  const totalMedia = (project.gallery?.length || 0) + (hasVideo ? 1 : 0);

  const nextMedia = () => setCurrentMedia((prev) => (prev + 1) % totalMedia);
  const prevMedia = () => setCurrentMedia((prev) => (prev - 1 + totalMedia) % totalMedia);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl relative max-h-[75vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-50 to-gray-100 p-6 border-b border-stone-200 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-stone-200/50 hover:bg-stone-300/50 rounded-full transition-colors z-10"
          >
             <Icons.X className="text-stone-700" width="20" height="20" /> 
          </button>
          <h3 className="text-3xl font-black text-stone-900 mb-2 pr-12">{project.name}</h3>
          <p className="text-lg text-stone-700 font-medium">{project.description}</p>
        </div>

        {/* Galeria de Mídia */}
        <div className="relative bg-stone-100 flex-grow flex items-center justify-center overflow-hidden">
          {/* Navegação */}
          {totalMedia > 1 && (
            <>
              <button
                onClick={prevMedia}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm text-orange-600 flex items-center justify-center shadow-lg hover:bg-white transition-all"
              >
                ‹
              </button>
              <button
                onClick={nextMedia}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm text-orange-600 flex items-center justify-center shadow-lg hover:bg-white transition-all"
              >
                ›
              </button>
            </>
          )}

          {/* Conteúdo da Mídia */}
          <AnimatePresence mode="wait">
            {hasVideo && currentMedia === 0 ? (
              <motion.video
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                controls
                className="max-w-full max-h-[50vh] object-contain"
              >
                <source src={`${import.meta.env.BASE_URL}${project.video}`} type="video/mp4" />
                Seu navegador não suporta vídeos.
              </motion.video>
            ) : (
              <motion.img
                key={currentMedia}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                src={`${import.meta.env.BASE_URL}${project.gallery[hasVideo ? currentMedia - 1 : currentMedia]}`}
                alt={`${project.name} - ${currentMedia + 1}`}
                className="max-w-full max-h-[50vh] object-contain"
              />
            )}
          </AnimatePresence>

          {/* Indicadores */}
          {totalMedia > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
              {Array.from({ length: totalMedia }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMedia(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentMedia === index ? 'w-8 bg-orange-500' : 'w-2 bg-orange-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer com Tecnologias */}
        <div className="p-6 border-t border-stone-200 bg-white">
          <h4 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
            <Icons.Code2 className="w-5 h-5 text-orange-500" />
            Tecnologias Utilizadas
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, i) => (
              <span
                key={i}
                className="text-sm bg-orange-50 text-orange-800 px-4 py-2 rounded-lg font-bold border border-orange-100"
              >
                {tech}
              </span>
            ))}
          </div>
          {project.link && (
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-md"
            >
              Acessar Projeto <Icons.ExternalLink width="16" height="16" />
            </motion.a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Seção Skills com Tabs e Autochange ---
function SkillsSection({ skills }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState('backend');
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const pauseTimeoutRef = useRef(null);

  const categories = {
    backend: { icon: 'Code2', label: 'Backend' },
    frontend: { icon: 'Palette', label: 'Frontend' },
    database: { icon: 'Database', label: 'Banco de Dados' },
    tools: { icon: 'Wrench', label: 'Ferramentas' },
    soft: { icon: 'Users', label: 'Soft Skills' }
  };

  const categoryKeys = Object.keys(categories);

  // Autochange a cada 4 segundos quando a seção está visível
  useEffect(() => {
    if (!isInView || autoplayPaused) return;
    
    const interval = setInterval(() => {
      setActiveCategory((prev) => {
        const currentIndex = categoryKeys.indexOf(prev);
        const nextIndex = (currentIndex + 1) % categoryKeys.length;
        return categoryKeys[nextIndex];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isInView, autoplayPaused, categoryKeys]);

  // Pausar autoplay por 10 segundos ao interagir
  const handleCategoryClick = (key) => {
    setActiveCategory(key);
    setAutoplayPaused(true);
    
    // Limpa timeout anterior se existir
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    // Reativa autoplay após 10 segundos
    pauseTimeoutRef.current = setTimeout(() => {
      setAutoplayPaused(false);
    }, 10000);
  };

  // Cleanup do timeout ao desmontar
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section id="skills" ref={ref} className="min-h-screen flex items-center justify-center px-4 py-32 relative z-10">
      <div className="max-w-5xl w-full">
        <SectionTitle isInView={isInView} subtitle="Tecnologias e habilidades que domino.">
          Skills & Ferramentas
        </SectionTitle>

        {/* Botões de Categorias */}
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
                onClick={() => handleCategoryClick(key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2 ${
                  isActive
                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-orange-300 hover:text-orange-600'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {cat.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Skills Grid com AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "backOut" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {skills[activeCategory]?.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-6 rounded-2xl border border-orange-100 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-black text-stone-800 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${skill.color}`}></div>
                    {skill.name}
                  </span>
                  <span className="text-sm font-bold text-stone-500 bg-stone-100 px-2 py-1 rounded-md">
                    {skill.level}%
                  </span>
                </div>

                {/* Barra de progresso */}
                <div className="relative h-4 bg-stone-100 rounded-full overflow-hidden border border-stone-200/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.2, delay: i * 0.05 + 0.2, ease: "easeOut" }}
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${skill.color} rounded-full shadow-sm`}
                  >
                    {/* Brilho na barra */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white/30 rounded-t-full"></div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const contacts = [
    { icon: 'Mail', label: 'Email', value: 'thiagoguilherme.barbosaa@gmail.com', href: 'mailto:thiagoguilherme.barbosaa@gmail.com', color: 'bg-blue-500' },
    { icon: 'Linkedin', label: 'LinkedIn', value: '/in/thiagoguilhermebarbosa', href: 'https://linkedin.com/in/thiagoguilhermebarbosa', color: 'bg-blue-600' },
    { icon: 'Github', label: 'GitHub', value: '/ThiagoGuilherme71', href: 'https://github.com/ThiagoGuilherme71', color: 'bg-stone-800' },
    { icon: 'MessageCircle', label: 'WhatsApp', value: '(71) 98694-9813', href: 'https://wa.me/5571986949813', color: 'bg-green-500' }
  ];

  return (
    <section id="contato" ref={ref} className="py-32 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* TEXTO ALTERADO PARA "CAFÉ" */}
        <SectionTitle isInView={isInView} subtitle="Sempre há tempo para novas conexões e desafios.">
            Vamos tomar um café? ☕
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
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative bg-stone-900 text-white pt-20 pb-10 px-6 z-10 overflow-hidden">
       <IllustrativeDecor variant="squiggle" className="absolute top-10 left-10 w-40 h-auto opacity-20 text-white" />
       <IllustrativeDecor variant="dots" className="absolute bottom-10 right-10 w-20 h-auto opacity-20 text-white" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg rotate-3">TG</div>
              <span className="text-3xl font-black text-white tracking-tight">Thiago Guilherme</span>
            </div>
            <p className="text-stone-400 text-lg max-w-md leading-relaxed font-medium">Desenvolvedor full-stack focado em criar soluções para o mundo real com técnica e a energia da Bahia.</p>
          </div>
          <div className="flex flex-col gap-3 justify-center md:justify-end">
             <a href="#hero" className="group flex items-center gap-2 text-lg font-bold text-orange-400 hover:text-orange-300 transition-colors bg-stone-800 px-6 py-3 rounded-full">
                Voltar ao topo <span className="group-hover:-translate-y-1 transition-transform">↑</span>
             </a>
             <a 
               href={`${import.meta.env.BASE_URL}cv_thiago_guilherme.pdf`}
               target="_blank"
               rel="noopener noreferrer"
               className="group flex items-center gap-2 text-lg font-bold text-blue-400 hover:text-blue-300 transition-colors bg-stone-800 px-6 py-3 rounded-full"
             >
                <Icons.Download className="w-5 h-5" /> Ver Currículo
             </a>
          </div>
        </div>
        <div className="pt-8 border-t border-stone-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-stone-500 font-medium">
          <p>© {new Date().getFullYear()} Thiago Guilherme. Todos os direitos reservados.</p>
          <p className="flex items-center gap-2">Feito com <strong class="text-orange">Dendê</strong>em Salvador.</p>
        </div>
      </div>
    </footer>
  );
}

export default App;