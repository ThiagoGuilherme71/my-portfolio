import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// Ícones SVG customizados
const Icons = {
  Code2: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  ),
  Palette: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5"></circle>
      <circle cx="17.5" cy="10.5" r=".5"></circle>
      <circle cx="8.5" cy="7.5" r=".5"></circle>
      <circle cx="6.5" cy="12.5" r=".5"></circle>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
    </svg>
  ),
  Database: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  ),
  Wrench: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
  ),
  Linkedin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  ),
  Github: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
      <path d="M9 18c-4.51 2-5-2-7-2"></path>
    </svg>
  ),
  MessageCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  ),
  MapPin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  Briefcase: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  ),
  Target: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  )
};

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', mouseMove);
    return () => window.removeEventListener('mousemove', mouseMove);
  }, []);

  const skills = {
    backend: [
      { name: 'PHP', level: 80 },
      { name: 'Laravel', level: 82 },
      { name: 'Java', level: 60 },
      { name: 'Spring Boot', level: 40 },
      { name: 'API REST', level: 75 },
    ],
    frontend: [
      { name: 'JavaScript', level: 75 },
      { name: 'React', level: 40 },
      { name: 'HTML5', level: 95 },
      { name: 'CSS3', level: 90 },
      { name: 'TailwindCSS', level: 70 },
      { name: 'Bootstrap', level: 75 },
      { name: 'React Native', level: 25 }
    ],
    database: [
      { name: 'MySQL', level: 85 },
      { name: 'Oracle', level: 70 },
      { name: 'PostgreSQL', level: 76 },
      { name: 'Redis', level: 60 },
      { name: 'Firebird', level: 70 },
      { name: 'NoSQL', level: 60 }
    ],
    tools: [
      { name: 'Git', level: 90 },
      { name: 'Docker', level: 70 },
      { name: 'AWS', level: 60 },
      { name: 'Linux', level: 75 },
      { name: 'Scrum', level: 70 },
      { name: 'CI/CD', level: 60 }
    ]
  };

  const experience = [
    {
      title: 'Desenvolvedor de Software',
      company: 'JCompany TI',
      period: 'Jun/2025 - Atual',
      location: 'Salvador - BA',
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
  ];

  const projects = [
    {
      name: 'SGLoc',
      description: 'ERP completo para locadoras com gestão de frotas, contratos e pagamentos. App mobile para vistoria.',
      tech: ['Laravel', 'Integrações Financeiras', 'Firebird', 'Redis', 'API REST'],
      link: 'https://sgloc.com.br',
      highlight: 'Em Produção'
    },
    {
      name: 'SysLog',
      description: 'Sistema de monitoramento de logs para secretaria municipal. Dashboard em tempo real com relatórios detalhados.',
      tech: ['PHP 7', 'Laravel', 'MySQL', 'Docker', 'Bootstrap', 'Tailwind'],
      highlight: '45% menos chamados'
    },
    {
      name: 'ByLink Soluções',
      description: 'Sistema de vagas e recrutamento (white label) com área pública para candidatos e painel de gestão privado para controle das candidaturas. Projeto desenvolvido por mim do desenvolvimento ao deploy.',
      tech: ['Next.js', 'Python', 'Supabase', 'Postgres'],
      link: 'https://www.bylinksolucoes.com.br/',
      highlight: 'White label • Full-stack'
    }
  ];

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800 relative overflow-x-hidden">
      {/* Textura de papel */}
      <div className="fixed inset-0 opacity-40 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Progress Bar */}
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 origin-left z-50" />

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-amber-50/95 backdrop-blur-md border-b-2 border-amber-900/20 z-40 shadow-lg"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
              TG
            </div>
            <span 
              className="text-amber-900 font-bold text-xl tracking-tight hidden sm:block"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Thiago Guilherme
            </span>
          </motion.div>
          
          <div className="flex gap-6 text-sm font-medium">
            {['Sobre', 'Experiência', 'Projetos', 'Skills', 'Contato'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                whileHover={{ scale: 1.05, y: -2 }}
                className="hidden sm:block text-stone-700 hover:text-amber-700 transition-colors relative group"
              >
                {item}
                <motion.span 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <HeroSection mousePosition={mousePosition} />

      {/* Sobre */}
      <SobreSection />

      {/* Experiência */}
      <section id="experiência" className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.15] pointer-events-none"
          style={{ backgroundImage: `url("${import.meta.env.BASE_URL}imgcafe.jpg")`, backgroundPosition: 'center 30%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 via-amber-50/10 to-transparent pointer-events-none" />

        <div className="max-w-5xl w-full">
          <SectionTitle title="Trajetória Profissional" />
          
          <div className="space-y-8">
            {experience.map((exp, index) => (
              <ExperienceCard key={index} exp={exp} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Projetos */}
      <section id="projetos" className="min-h-screen flex items-center justify-center px-4 py-20 bg-amber-100/30">
        <div className="max-w-5xl w-full">
          <SectionTitle title="Principais Projetos" />
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl w-full">
          <SectionTitle title="Conhecimentos Técnicos" />
          
          <div className="grid sm:grid-cols-2 gap-6">
            {Object.entries(skills).map(([category, items], index) => (
              <SkillCard key={category} category={category} items={items} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-20 px-4 bg-gradient-to-b from-amber-100/30 to-amber-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>
              Bora Tomar um Café? ☕
            </h2>
            
            <p className="text-lg text-stone-600 mb-10 max-w-2xl mx-auto">
              Sempre pronto para conversar sobre projetos interessantes e novas oportunidades.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { 
                  icon: 'Mail', 
                  label: 'Email', 
                  value: 'Enviar mensagem',
                  href: 'mailto:thiagoguilherme.barbosaa@gmail.com',
                  color: 'from-blue-600 to-blue-700'
                },
                { 
                  icon: 'Linkedin', 
                  label: 'LinkedIn', 
                  value: 'Ver perfil',
                  href: 'https://linkedin.com/in/thiagoguilhermebarbosa',
                  color: 'from-blue-500 to-blue-600'
                },
                { 
                  icon: 'Github', 
                  label: 'GitHub', 
                  value: 'Ver repositórios',
                  href: 'https://github.com/ThiagoGuilherme71',
                  color: 'from-gray-400 to-gray-500'
                },
                { 
                  icon: 'MessageCircle', 
                  label: 'WhatsApp', 
                  value: 'Chamar agora',
                  href: 'https://wa.me/5571986949813?text=Olá%20Thiago!%20Vi%20seu%20portfólio%20e%20gostaria%20de%20conversar.',
                  color: 'from-green-600 to-green-700'
                }
              ].map((contact, i) => {
                const IconComponent = Icons[contact.icon];
                return (
                  <motion.a
                    key={i}
                    href={contact.href}
                    target={contact.href.startsWith('http') ? '_blank' : undefined}
                    rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5, scale: 1.03 }}
                    className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border-2 border-amber-700/20 shadow-lg hover:shadow-xl transition-all group"
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${contact.color} rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                      <IconComponent />
                    </div>
                    <div className="text-sm font-semibold text-amber-900 mb-1">{contact.label}</div>
                    <div className="text-xs text-stone-600">{contact.value}</div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-amber-900/20 bg-gradient-to-b from-amber-50 to-amber-100/50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                  TG
                </div>
                <span className="text-amber-900 font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                  Thiago Guilherme
                </span>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed">
                Desenvolvedor full-stack apaixonado por criar soluções que impactam positivamente a vida das pessoas.
              </p>
            </div>

            <div>
              <h3 className="text-amber-900 font-bold mb-4">Links Rápidos</h3>
              <div className="space-y-2">
                {['Sobre', 'Experiência', 'Projetos', 'Skills', 'Contato'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block text-stone-600 hover:text-amber-700 transition-colors text-sm"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-amber-900 font-bold mb-4">Contato</h3>
              <div className="space-y-3 text-sm text-stone-600">
                <div className="flex items-center gap-2">
                  <Icons.MapPin />
                  <span>Salvador - BA, Brasil</span>
                </div>
                <a href="mailto:thiagoguilherme.barbosaa@gmail.com" className="flex items-center gap-2 hover:text-amber-700 transition-colors">
                  <Icons.Mail />
                  <span>thiagoguilherme.barbosaa@gmail.com</span>
                </a>
                <div className="flex gap-3 pt-2">
                  {[
                    { icon: 'Linkedin', url: 'https://linkedin.com/in/thiagoguilhermebarbosa' },
                    { icon: 'Github', url: 'https://github.com/ThiagoGuilherme71' },
                    { icon: 'MessageCircle', url: 'https://wa.me/5571986949813' }
                  ].map((social, i) => {
                    const IconComponent = Icons[social.icon];
                    return (
                      <motion.a
                        key={i}
                        whileHover={{ scale: 1.15, y: -2 }}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-amber-700 rounded-lg flex items-center justify-center text-white hover:bg-amber-800 transition-colors"
                      >
                        <IconComponent />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-amber-900/20 pt-8 text-center">
            <p className="text-stone-600 text-sm mb-2">
              Feito com ☕ em Salvador - BA
            </p>
            <p className="text-xs text-stone-500 mb-3">
              React • TailwindCSS • Framer Motion
            </p>
            <p className="text-amber-800 font-semibold">
              © 2025 Thiago Guilherme - Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: scrollYProgress.get() > 0.15 ? 1 : 0, 
          scale: scrollYProgress.get() > 0.15 ? 1 : 0.8
        }}
        whileHover={{ scale: 1.15, rotate: 360 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700 text-white p-4 rounded-full shadow-2xl z-40 border-2 border-amber-100/30 group"
        style={{ display: scrollYProgress.get() > 0.15 ? 'block' : 'none' }}
      >
        <span className="relative flex items-center justify-center">
          <span className="absolute inset-0 w-full h-full rounded-full animate-ping bg-amber-500/30"></span>
          
          <motion.span 
            className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 opacity-30 blur-md"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
            className="w-6 h-6 relative z-10 drop-shadow-lg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        </span>
      </motion.button>
    </div>
  );
}

function HeroSection({ mousePosition }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `url("${import.meta.env.BASE_URL}imgportifolio.jpg")`,
          backgroundPosition: 'center 30%'
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 via-amber-50/10 to-transparent pointer-events-none" />
      
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          y: [0, 30, 0],
          x: [0, -15, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 left-10 w-40 h-40 bg-orange-200/20 rounded-full blur-3xl"
      />
      
      <motion.div
        style={{
          x: mousePosition.x / 80,
          y: mousePosition.y / 80
        }}
        className="absolute inset-0 bg-gradient-radial from-amber-200/30 via-transparent to-transparent blur-3xl"
      />

      <div className="max-w-4xl w-full relative z-10 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <div className="inline-block px-6 py-2 bg-amber-100 border-2 border-amber-700/30 rounded-full text-amber-900 font-medium mb-8">
            Salvador - BA • Brasil
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 text-amber-900 leading-tight"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {'Thiago Guilherme'.split('').map((char, index) => (
            <motion.span
              key={index}
              className="inline-block"
              animate={{
                y: [0, -4.5, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 2,
                delay: index * 0.05,
                ease: "easeInOut"
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-2xl sm:text-3xl text-stone-600 mb-8 font-light"
        >
          <strong>Desenvolvedor De Software</strong>
        </motion.div>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-xl text-stone-600 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Resolver problemas e dores do mundo real através da tecnologia é o que me impulsiona. <strong>Vamos melhorar o mundo juntos?!</strong>
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          {[
            { text: 'Ver Projetos', url: '#projetos', primary: true },
            { text: 'LinkedIn', url: 'https://linkedin.com/in/thiagoguilhermebarbosa' },
            { text: 'GitHub', url: 'https://github.com/ThiagoGuilherme71' }
          ].map((btn, i) => (
            <motion.a
              key={i}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={btn.url}
              target={btn.url.startsWith('http') ? '_blank' : undefined}
              rel={btn.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`px-8 py-3 font-semibold rounded-lg transition-transform duration-150 ease-out ${
                btn.primary
                  ? 'bg-amber-700 text-amber-50 shadow-lg hover:bg-amber-800'
                  : 'border-2 border-amber-700 text-amber-900 hover:bg-amber-100'
              }`}
            >
              {btn.text}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SobreSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="sobre" ref={ref} className="min-h-screen flex items-center justify-center px-4 py-20 bg-amber-100/30">
      <div className="max-w-4xl w-full">
        <SectionTitle title="Sobre Mim" />

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="bg-white/70 backdrop-blur-sm p-8 sm:p-12 rounded-2xl border-2 border-amber-700/20 shadow-xl"
        >
          <div className="space-y-6 text-stone-700 text-lg leading-relaxed">
            <p>
              Olá! Sou <strong className="text-amber-800">Thiago Guilherme</strong>, desenvolvedor full-stack 
              com foco em PHP e Laravel, natural de Salvador - BA. Minha jornada na tecnologia começou 
              em 2023, e desde então tenho me dedicado a criar soluções que realmente fazem a diferença. Busco aprendizagem e troca de ideias contínuas.
            </p>
            <p>
              Atualmente trabalho na <strong className="text-amber-800">JCompany TI</strong>, onde desenvolvo 
              aplicações SaaS e APIs complexas. Uma das minhas maiores entregas foi o SysLog, 
              sistema que reduziu <strong className="text-amber-800">45% dos chamados de suporte </strong> 
              na Secretaria Municipal de Gestão.
            </p>
            <p>
              Formado em <strong className="text-amber-800">Análise e Desenvolvimento de Sistemas</strong> pela 
              UCSAL com média 9.0, busco constantemente novos desafios e oportunidades de crescimento. Meu 
              objetivo é continuar evoluindo tecnicamente enquanto entrego valor real aos projetos que participo.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t-2 border-amber-700/20">
              {[
                { label: 'Localização', value: 'Salvador - BA', icon: 'MapPin' },
                { label: 'Experiência', value: '2+ anos', icon: 'Calendar' },
                { label: 'Projetos', value: '10+ entregues', icon: 'Briefcase' },
                { label: 'Foco', value: 'PHP & Laravel', icon: 'Target' }
              ].map((item, i) => {
                const IconComponent = Icons[item.icon];
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    className="text-center group"
                  >
                    <div className="flex justify-center mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent />
                      </div>
                    </div>
                    <div className="text-xl font-bold text-amber-800 mb-1">{item.value}</div>
                    <div className="text-xs text-stone-600">{item.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SectionTitle({ title }) {
  return (
    <motion.h2
      initial={{ x: -30, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="text-4xl sm:text-5xl font-bold mb-12 text-amber-900 text-center"
      style={{ fontFamily: 'Georgia, serif' }}
    >
      {title}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: '80px' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="h-1 bg-amber-700 mx-auto mt-4"
      />
    </motion.h2>
  );
}

function ExperienceCard({ exp, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0, rotateY: 45 }}
      animate={isInView ? { x: 0, opacity: 1, rotateY: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(180, 83, 9, 0.25)"
      }}
      className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-amber-700/20 shadow-lg transition-all relative overflow-hidden group"
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/50 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-600 to-orange-600 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 relative z-10">
        <div>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.15 + 0.2 }}
            className="text-2xl font-bold text-amber-900 mb-2"
          >
            {exp.title}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: index * 0.15 + 0.3 }}
            className="text-xl text-stone-700 font-semibold"
          >
            {exp.company}
          </motion.p>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.4 }}
          className="text-stone-600 text-sm mt-3 sm:mt-0 sm:text-right"
        >
          <p className="font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full inline-block">{exp.period}</p>
          <p className="mt-1">{exp.location}</p>
        </motion.div>
      </div>
      <ul className="space-y-3 relative z-10">
        {exp.achievements.map((achievement, i) => (
          <motion.li
            key={i}
            initial={{ x: -30, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ 
              delay: index * 0.15 + 0.5 + i * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ x: 5 }}
            className="flex items-start text-stone-700 group/item"
          >
            <motion.span 
              className="text-amber-700 mr-3 mt-1 font-bold"
              whileHover={{ scale: 1.3, rotate: 90 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              ▸
            </motion.span>
            <span className="group-hover/item:text-amber-900 transition-colors">{achievement}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ scale: 1.03, y: -8 }}
      className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-amber-700/20 shadow-lg hover:shadow-2xl transition-all relative overflow-hidden"
    >
      <div className="absolute top-4 right-4 bg-amber-700 text-amber-50 px-4 py-1 rounded-full text-sm font-semibold">
        {project.highlight}
      </div>
      
      <h3 className="text-3xl font-bold text-amber-900 mb-4 mt-8">
        {project.name}
      </h3>
      
      <p className="text-stone-700 mb-6 leading-relaxed">{project.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tech.map((tech, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: index * 0.2 + 0.4 + i * 0.05 }}
            whileHover={{ scale: 1.1 }}
            className="text-sm bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-700/30"
          >
            {tech}
          </motion.span>
        ))}
      </div>
      
      {project.link && (
        <motion.a
          whileHover={{ x: 5 }}
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-amber-800 font-semibold hover:text-amber-600 transition-colors"
        >
          Ver projeto <span>→</span>
        </motion.a>
      )}
    </motion.div>
  );
}

function SkillCard({ category, items, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const iconMap = {
    backend: 'Code2',
    frontend: 'Palette',
    database: 'Database',
    tools: 'Wrench'
  };

  const IconComponent = Icons[iconMap[category]];

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-amber-700/20 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-amber-900 capitalize flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
            <IconComponent />
          </div>
          {category}
        </h3>
        <span className="text-sm text-stone-500 bg-amber-50 px-3 py-1 rounded-full">{items.length} itens</span>
      </div>

      <div className="space-y-4">
        {items.map((skill, i) => (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: index * 0.08 + i * 0.06 }}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="text-stone-700 font-medium">{skill.name}</div>
              <div className="text-sm text-stone-500 font-semibold">{skill.level}%</div>
            </div>

            <div className="w-full bg-amber-100 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-amber-600 to-orange-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={isInView ? { width: `${skill.level}%` } : {}}
                transition={{ duration: 1, delay: index * 0.08 + i * 0.06 + 0.2, ease: "easeOut" }}
                role="progressbar"
                aria-valuenow={skill.level}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default App;