import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

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
      { name: 'PHP 7', level: 92 },
      { name: 'Laravel', level: 90 },
      { name: 'CodeIgniter', level: 72 },
      { name: 'Spring Boot', level: 60 },
      { name: 'API REST', level: 88 }
    ],
    frontend: [
      { name: 'JavaScript', level: 88 },
      { name: 'React', level: 84 },
      { name: 'React Native', level: 68 },
      { name: 'HTML5', level: 95 },
      { name: 'CSS3', level: 90 },
      { name: 'TailwindCSS', level: 82 }
    ],
    database: [
      { name: 'MySQL', level: 88 },
      { name: 'Oracle', level: 70 },
      { name: 'PostgreSQL', level: 76 },
      { name: 'Redis', level: 64 },
      { name: 'Firebird', level: 48 },
      { name: 'NoSQL', level: 72 }
    ],
    tools: [
      { name: 'Git', level: 90 },
      { name: 'Docker', level: 74 },
      { name: 'AWS', level: 66 },
      { name: 'Linux', level: 78 },
      { name: 'Scrum', level: 62 },
      { name: 'CI/CD', level: 70 }
    ]
  };

  const experience = [
    {
      title: 'Desenvolvedor de Software',
      company: 'JCompany TI',
      period: 'Jun/2025 - Atual',
      location: 'Salvador - BA',
      achievements: [
        'Desenvolvimento de aplicações SaaS com PHP 7 e Laravel',
        'Integração de APIs REST e microserviços',
        'Projetos estratégicos com impacto direto na receita',
        'Trabalho com AWS, Docker e CI/CD'
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
        'Trabalho com MySQL, Oracle e APIs RESTful',
        'Metodologias ágeis em ambiente colaborativo'
      ]
    }
  ];

  const projects = [
    {
      name: 'SGLoc',
      description: 'SaaS completo para locadoras com gestão de frotas, contratos e pagamentos. App mobile para vistoria.',
      tech: ['Laravel', 'React Native', 'MySQL', 'Redis', 'API REST'],
      link: 'https://sgloc.com.br',
      highlight: 'Em Produção'
    },
    {
      name: 'SysLog',
      description: 'Sistema de monitoramento de logs para secretaria municipal. Dashboard em tempo real com relatórios detalhados.',
      tech: ['PHP 7', 'Laravel', 'MySQL', 'Docker', 'Bootstrap'],
      highlight: '45% menos chamados'
    }
    ,
    {
      name: 'ByLink Soluções',
      description: 'Sistema de vagas e recrutamento (white label) com área pública e painel de gestão privado para controle das candidaturas. Projeto desenvolvido por mim do desenvolvimento ao deploy.',
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
        className="fixed top-0 w-full bg-amber-50/95 backdrop-blur-sm border-b-2 border-amber-900/20 z-40 shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="text-amber-900 font-bold text-xl tracking-tight cursor-pointer"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Thiago Guilherme
          </motion.span>
          
          <div className="flex gap-8 text-sm font-medium">
            {['Sobre', 'Experiência', 'Projetos', 'Skills', 'Contato'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                whileHover={{ scale: 1.05 }}
                className="hidden sm:block text-stone-700 hover:text-amber-700 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-700 group-hover:w-full transition-all duration-300"></span>
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
        {/* Foto de fundo discreta (imgcafe) */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.15] pointer-events-none"
          style={{ backgroundImage: 'url("/imgcafe.jpg")', backgroundPosition: 'center 30%' }}
        />

        {/* Overlay suave para manter legibilidade */}
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
          <SectionTitle title="Projetos Principais" />
          
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
      <section id="contato" className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-amber-100/30 to-amber-50">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl w-full text-center"
        >
          <h2 className="text-5xl sm:text-6xl font-bold mb-6 text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>
            Vamos Trabalhar Juntos?
          </h2>

          <p className="text-xl text-stone-600 mb-12 leading-relaxed">
            Estou sempre aberto a novos desafios e conversas interessantes.<br />
            Que tal tomarmos um café e discutirmos seu próximo projeto?
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <motion.a
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:thiagoguilherme.barbosaa@gmail.com"
              className="px-10 py-4 bg-amber-700 text-amber-50 font-semibold rounded-lg shadow-lg hover:bg-amber-800 transition-all"
            >
              Enviar Email
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              href="https://linkedin.com/in/thiagoguilhermebarbosa"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 border-2 border-amber-700 text-amber-900 font-semibold rounded-lg hover:bg-amber-100 transition-all"
            >
              Ver LinkedIn
            </motion.a>
          </div>

          <div className="flex justify-center gap-8 text-3xl">
            {[
              { name: 'GitHub', url: 'https://github.com/ThiagoGuilherme71', icon: '🔗' },
              { name: 'LinkedIn', url: 'https://linkedin.com/in/thiagoguilhermebarbosa', icon: '💼' }
            ].map((social) => (
              <motion.a
                key={social.name}
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ duration: 0.3 }}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 hover:text-amber-600 transition-colors"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-amber-900/20 py-8 text-center bg-amber-50">
        <div className="text-stone-600 space-y-2">
          <p className="text-lg">
            Feito com ☕ em Salvador - BA
          </p>
          <p className="text-sm">React • TailwindCSS • Framer Motion</p>
          <p className="text-amber-800 font-semibold">© 2025 Thiago Guilherme</p>
        </div>
      </footer>

      {/* Scroll to Top */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollYProgress.get() > 0.2 ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-amber-700 text-amber-50 p-4 rounded-full shadow-xl z-40 font-bold text-xl hover:bg-amber-800 transition-colors"
      >
        ↑
      </motion.button>
    </div>
  );
}

function HeroSection({ mousePosition }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
      {/* Foto de fundo discreta */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.15]  pointer-events-none"
        style={{
          backgroundImage: 'url("/imgportifolio.jpg")',
          backgroundPosition: 'center 30%'
        }}
      />

      {/* Overlay gradiente mais suave para permitir ver a imagem */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 via-amber-50/10 to-transparent pointer-events-none" />
      
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
          Thiago Guilherme
        </motion.h1>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-2xl sm:text-3xl text-stone-600 mb-8 font-light"
        >
          Desenvolvedor Full-Stack
        </motion.div>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-xl text-stone-600 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Código limpo, eficaz e eficiente. Ideias claras. Soluções reais.
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
              className={`px-8 py-3 font-semibold rounded-lg transition-all ${
                btn.primary
                  ? 'bg-amber-700 text-amber-50 shadow-lg hover:bg-amber-800'
                  : 'border-2 border-amber-700 text-amber-900 hover:bg-amber-100'
              }`}
            >
              {btn.text}
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-amber-700 text-3xl"
        >
          
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
              em 2023, e desde então tenho me dedicado a criar soluções que realmente fazem a diferença.
            </p>
            <p>
              Atualmente trabalho na <strong className="text-amber-800">JCompany TI</strong>, onde desenvolvo 
              aplicações SaaS e APIs complexas. Um dos meus maiores orgulhos foi o desenvolvimento do SysLog, 
              sistema que reduziu <strong className="text-amber-800">45% dos chamados de suporte</strong> em 
              uma secretaria municipal.
            </p>
            <p>
              Formado em <strong className="text-amber-800">Análise e Desenvolvimento de Sistemas</strong> pela 
              UCSAL com média 9.0, busco constantemente novos desafios e oportunidades de crescimento. Meu 
              objetivo é continuar evoluindo tecnicamente enquanto entrego valor real aos projetos que participo.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t-2 border-amber-700/20">
              {[
                { label: 'Localização', value: 'Salvador - BA' },
                { label: 'Experiência', value: '2+ anos' },
                { label: 'Projetos', value: '10+ concluídos & sustentados' },
                { label: 'Foco', value: 'PHP & Laravel' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-amber-800 mb-1">{item.value}</div>
                  <div className="text-sm text-stone-600">{item.label}</div>
                </motion.div>
              ))}
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
      initial={{ y: 50, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ y: -5 }}
      className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border-2 border-amber-700/20 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-amber-900 mb-2">{exp.title}</h3>
          <p className="text-xl text-stone-700 font-semibold">{exp.company}</p>
        </div>
        <div className="text-stone-600 text-sm mt-3 sm:mt-0 sm:text-right">
          <p className="font-semibold text-amber-800">{exp.period}</p>
          <p>{exp.location}</p>
        </div>
      </div>
      <ul className="space-y-3">
        {exp.achievements.map((achievement, i) => (
          <motion.li
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: index * 0.2 + 0.3 + i * 0.1 }}
            className="flex items-start text-stone-700"
          >
            <span className="text-amber-700 mr-3 mt-1">•</span>
            <span>{achievement}</span>
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

  const icons = {
    backend: '⚙️',
    frontend: '🎨',
    database: '💾',
    tools: '🛠️'
  };
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
          <span className="text-2xl">{icons[category]}</span>
          {category}
        </h3>
        <span className="text-sm text-stone-500">{items.length} itens</span>
      </div>

      <div className="space-y-4">
        {items.map((skill, i) => (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: index * 0.08 + i * 0.06 }}
            className=""
          >
            <div className="flex justify-between items-center mb-1">
              <div className="text-stone-700 font-medium">{skill.name}</div>
              <div className="text-sm text-stone-500 font-semibold">{skill.level}%</div>
            </div>

            <div className="w-full bg-amber-100 rounded-full h-2">
              <div
                className="bg-amber-700 h-2 rounded-full transition-all"
                style={{ width: `${skill.level}%` }}
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