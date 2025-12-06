import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    '> Sistema inicializado...',
    '> Carregando perfil do desenvolvedor...',
    '> Thiago Guilherme conectado! ✓'
  ]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Matrix effect
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / 20);
    const drops = Array(columns).fill(1);
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#10b981';
      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);
        
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  // Custom cursor
  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', mouseMove);
    return () => window.removeEventListener('mousemove', mouseMove);
  }, []);

  // Terminal commands
  const handleTerminalCommand = (e) => {
    if (e.key === 'Enter' && terminalInput.trim()) {
      const cmd = terminalInput.toLowerCase().trim();
      let response = '';

      if (cmd === 'help') {
        response = 'Comandos: help, sobre, skills, projetos, contato, clear, whoami';
      } else if (cmd === 'sobre') {
        response = 'Dev full-stack PHP | Salvador-BA | 2+ anos exp';
      } else if (cmd === 'skills') {
        response = 'PHP • Laravel • React • MySQL • Docker • AWS';
      } else if (cmd === 'projetos') {
        response = 'SGLoc (SaaS) | SysLog (-45% chamados)';
      } else if (cmd === 'contato') {
        response = 'Email: thiagoguilherme.barbosaa@gmail.com';
      } else if (cmd === 'clear') {
        setTerminalHistory([]);
        setTerminalInput('');
        return;
      } else if (cmd === 'whoami') {
        response = 'Thiago Guilherme - Transformando café em código ☕';
      } else {
        response = `Comando não encontrado: ${cmd}. Digite 'help' para ajuda.`;
      }

      setTerminalHistory([...terminalHistory, `> ${terminalInput}`, response]);
      setTerminalInput('');
    }
  };

  const skills = {
    backend: ['PHP 7', 'Laravel', 'CodeIgniter', 'Spring Boot', 'API REST'],
    frontend: ['JavaScript', 'React', 'React Native', 'HTML5', 'CSS3', 'TailwindCSS'],
    database: ['MySQL', 'Oracle', 'PostgreSQL', 'Redis', 'Firebird', 'NoSQL'],
    tools: ['Git', 'Docker', 'AWS', 'Linux', 'Scrum', 'CI/CD']
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
      ],
      color: 'from-green-500 to-emerald-500'
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
      ],
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  const projects = [
    {
      name: 'SGLoc',
      description: 'SaaS completo para locadoras com gestão de frotas, contratos e pagamentos. App mobile para vistoria.',
      tech: ['Laravel', 'React Native', 'MySQL', 'Redis', 'API REST'],
      link: 'https://sgloc.com.br',
      highlight: '🚀 Produção',
      gradient: 'from-purple-500 via-pink-500 to-red-500'
    },
    {
      name: 'SysLog',
      description: 'Sistema de monitoramento de logs para secretaria municipal. Dashboard em tempo real com relatórios detalhados.',
      tech: ['PHP 7', 'Laravel', 'MySQL', 'Docker', 'Bootstrap'],
      highlight: '📊 -45% chamados',
      gradient: 'from-green-500 via-teal-500 to-blue-500'
    }
  ];

  const variants = {
    default: { x: mousePosition.x - 16, y: mousePosition.y - 16 },
    hover: { x: mousePosition.x - 32, y: mousePosition.y - 32, scale: 2 }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 relative overflow-x-hidden">
      {/* Matrix Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 opacity-20 pointer-events-none z-0" />

      {/* Custom Cursor */}
      <motion.div
        variants={variants}
        animate={cursorVariant}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        className="fixed w-8 h-8 border-2 border-green-400 rounded-full pointer-events-none z-50 mix-blend-difference hidden lg:block"
      />

      {/* Progress Bar */}
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 origin-left z-50" />

      {/* Navbar com Glitch */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-black/80 backdrop-blur-xl border-b border-green-500/30 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <motion.span 
            whileHover={{ scale: 1.1 }}
            className="text-green-400 font-mono text-xl font-bold relative group cursor-pointer"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <span className="relative z-10">{'<TG />'}</span>
            <span className="absolute inset-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" style={{ textShadow: '2px 0 red' }}>{'<TG />'}</span>
            <span className="absolute inset-0 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" style={{ textShadow: '-2px 0 blue' }}>{'<TG />'}</span>
          </motion.span>
          
          <div className="flex gap-6 font-mono text-sm">
            {['sobre', 'exp', 'projetos', 'skills', 'terminal'].map((item) => (
              <motion.a
                key={item}
                href={`#${item}`}
                whileHover={{ scale: 1.1, color: '#10b981' }}
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
                className="hidden sm:block hover:text-green-400 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Hero com Parallax */}
      <ParallaxHero mousePosition={mousePosition} setCursorVariant={setCursorVariant} />

      {/* Sobre com Reveal */}
      <SobreSection setCursorVariant={setCursorVariant} />

      {/* Experiência com Timeline */}
      <section id="exp" className="min-h-screen flex items-center justify-center px-4 py-20 relative">
        <div className="max-w-6xl w-full">
          <SectionTitle number="02" title="Jornada Profissional" />
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-emerald-500 to-green-500 hidden md:block"></div>
            
            {experience.map((exp, index) => (
              <ExperienceCard key={index} exp={exp} index={index} setCursorVariant={setCursorVariant} />
            ))}
          </div>
        </div>
      </section>

      {/* Projetos com 3D Cards */}
      <section id="projetos" className="min-h-screen flex items-center justify-center px-4 py-20 relative">
        <div className="max-w-6xl w-full">
          <SectionTitle number="03" title="Projetos em Destaque" />
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} setCursorVariant={setCursorVariant} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills com Animação Diferente */}
      <section id="skills" className="min-h-screen flex items-center justify-center px-4 py-20 relative">
        <div className="max-w-6xl w-full">
          <SectionTitle number="04" title="Arsenal Tecnológico" />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(skills).map(([category, items], index) => (
              <SkillCard key={category} category={category} items={items} index={index} setCursorVariant={setCursorVariant} />
            ))}
          </div>
        </div>
      </section>

      {/* Terminal Interativo */}
      <section id="terminal" className="min-h-screen flex items-center justify-center px-4 py-20 relative">
        <div className="max-w-4xl w-full">
          <SectionTitle number="05" title="Terminal Interativo" />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gray-900 rounded-xl border border-green-500/30 overflow-hidden shadow-2xl shadow-green-500/20"
          >
            {/* Terminal Header */}
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-green-500/30">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm font-mono ml-4">thiago@portfolio:~$</span>
            </div>
            
            {/* Terminal Body */}
            <div className="p-6 font-mono text-sm h-96 overflow-y-auto">
              <div className="mb-4 text-green-400">
                <TypeAnimation
                  sequence={[
                    'Bem-vindo ao meu terminal! Digite "help" para começar...',
                    1000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={1}
                />
              </div>
              
              {terminalHistory.map((line, i) => (
                <div key={i} className={line.startsWith('>') ? 'text-green-400 mb-1' : 'text-gray-300 mb-3'}>
                  {line}
                </div>
              ))}
              
              <div className="flex items-center gap-2">
                <span className="text-green-400">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={handleTerminalCommand}
                  className="flex-1 bg-transparent outline-none text-gray-100"
                  placeholder="Digite um comando..."
                  autoFocus
                />
                <span className="animate-pulse text-green-400">_</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contato com Animação Especial */}
      <section id="contato" className="min-h-screen flex items-center justify-center px-4 py-20 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl w-full text-center"
        >
          <motion.div
            animate={{ 
              textShadow: ['0 0 20px rgba(16,185,129,0.8)', '0 0 40px rgba(16,185,129,0.4)', '0 0 20px rgba(16,185,129,0.8)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl sm:text-7xl font-bold mb-8 font-mono text-green-400"
          >
            Vamos conversar?
          </motion.div>

          <p className="text-xl text-gray-400 mb-12">
            Estou sempre aberto a novos desafios e oportunidades interessantes!
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.a
              whileHover={{ scale: 1.1, rotate: 3 }}
              whileTap={{ scale: 0.9 }}
              href="mailto:thiagoguilherme.barbosaa@gmail.com"
              className="group relative px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900 font-mono font-bold rounded-lg overflow-hidden"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              <span className="relative z-10">📧 Email</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.1, rotate: -3 }}
              whileTap={{ scale: 0.9 }}
              href="https://linkedin.com/in/thiagoguilhermebarbosa"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 border-2 border-green-500 text-green-400 font-mono font-bold rounded-lg hover:bg-green-500/10 transition-all"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              💼 LinkedIn
            </motion.a>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-16 flex justify-center gap-8"
          >
            {[
              { name: 'GitHub', url: 'https://github.com/ThiagoGuilherme71', icon: '⚡' },
              { name: 'LinkedIn', url: 'https://linkedin.com/in/thiagoguilhermebarbosa', icon: '💼' }
            ].map((social) => (
              <motion.a
                key={social.name}
                whileHover={{ scale: 1.3, rotate: 360 }}
                transition={{ duration: 0.3 }}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-500/20 py-8 text-center relative z-10">
        <div className="text-gray-500 font-mono text-sm space-y-2">
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Desenvolvido com ☕ e muito 💚
          </motion.p>
          <p>React • Vite • TailwindCSS • Framer Motion</p>
          <p className="text-green-400">© 2025 Thiago Guilherme</p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollYProgress.get() > 0.2 ? 1 : 0 }}
        whileHover={{ scale: 1.2, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900 p-4 rounded-full shadow-2xl shadow-green-500/50 z-40 font-bold text-xl"
        onMouseEnter={() => setCursorVariant('hover')}
        onMouseLeave={() => setCursorVariant('default')}
      >
        ↑
      </motion.button>
    </div>
  );
}

// Componentes auxiliares
function ParallaxHero({ mousePosition, setCursorVariant }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden">
      <motion.div
        style={{
          x: mousePosition.x / 50,
          y: mousePosition.y / 50
        }}
        className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 blur-3xl"
      />

      <div className="max-w-5xl w-full relative z-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-6"
        >
          <span className="text-green-400 font-mono text-lg bg-green-400/10 px-4 py-2 rounded-lg border border-green-500/30 inline-block">
            $ whoami --verbose
          </span>
        </motion.div>

        <motion.h1
          initial={{ x: -100, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl sm:text-8xl lg:text-9xl font-bold mb-6 relative"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 font-mono">
            <TypeAnimation
              sequence={['Thiago', 1000, 'Thiago Guilherme', 2000]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </span>
          <motion.div
            animate={{
              boxShadow: [
                '0 0 30px rgba(16,185,129,0.4)',
                '0 0 80px rgba(16,185,129,0.2)',
                '0 0 30px rgba(16,185,129,0.4)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -inset-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-3xl -z-10"
          />
        </motion.h1>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-3xl sm:text-4xl text-gray-300 mb-10 font-mono"
        >
          <span className="text-green-400">{'>'}</span>{' '}
          <TypeAnimation
            sequence={[
              'Desenvolvedor Full-Stack',
              2000,
              'PHP • Laravel • React',
              2000,
              'Transformando Café em Código',
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </motion.div>

        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl text-gray-400 mb-12 max-w-3xl leading-relaxed"
        >
          Desenvolvedor apaixonado por tecnologia, especializado em criar soluções robustas e escaláveis. 
          2+ anos construindo experiências digitais que importam.
        </motion.p>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex gap-4 flex-wrap"
        >
          {[
            { text: 'GitHub', url: 'https://github.com/ThiagoGuilherme71', primary: true },
            { text: 'LinkedIn', url: 'https://linkedin.com/in/thiagoguilhermebarbosa' },
            { text: 'Download CV', url: '#' }
          ].map((btn, i) => (
            <motion.a
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              href={btn.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
              className={`px-8 py-4 font-mono font-bold rounded-lg transition-all ${
                btn.primary
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900 shadow-lg shadow-green-500/30'
                  : 'border-2 border-green-500/50 text-green-400 hover:bg-green-500/10'
              }`}
            >
              {btn.text}
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-green-400 text-3xl"
        >
          ↓
        </motion.div>
      </div>
    </section>
  );
}

function SobreSection({ setCursorVariant }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="sobre" ref={ref} className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-5xl w-full">
        <SectionTitle number="01" title="Sobre Mim" />

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-gray-300 text-lg leading-relaxed"
          >
            <p>
              Olá! 👋 Sou <span className="text-green-400 font-bold">Thiago Guilherme</span>, desenvolvedor full-stack 
              especializado em PHP e Laravel. Minha jornada começou em 2024 e desde então tenho me dedicado a 
              criar soluções que realmente fazem diferença.
            </p>
            <p>
              Atualmente na <span className="text-green-400 font-semibold">JCompany TI</span>, desenvolvo aplicações 
              SaaS e APIs complexas. Um dos meus maiores orgulhos foi criar o SysLog, que reduziu 
              <span className="text-green-400 font-bold"> 45% dos chamados de suporte</span>!
            </p>
            <p>
              Formado em <span className="text-green-400 font-semibold">Análise e Desenvolvimento de Sistemas</span> pela 
              UCSAL com média 9.0. Sempre em busca de novos desafios! 🚀
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-8 rounded-2xl border border-green-500/30 backdrop-blur-sm">
              <h3 className="text-green-400 font-mono text-2xl mb-6 flex items-center gap-3">
                <span className="text-3xl">⚡</span> Quick Facts
              </h3>
              <ul className="space-y-4 text-gray-300 text-lg">
                {[
                  { icon: '📍', label: 'Localização', value: 'Salvador - BA' },
                  { icon: '💼', label: 'Experiência', value: '2+ anos' },
                  { icon: '🚀', label: 'Projetos', value: '10+ concluídos' },
                  { icon: '🎯', label: 'Foco', value: 'PHP • Laravel • React' }
                ].map((fact, i) => (
                  <motion.li
                    key={i}
                    initial={{ x: 50, opacity: 0 }}
                    animate={isInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-start gap-3"
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  >
                    <span className="text-2xl">{fact.icon}</span>
                    <div>
                      <strong className="text-green-400">{fact.label}:</strong> {fact.value}
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ number, title }) {
  return (
    <motion.h2
      initial={{ x: -50, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="text-5xl font-bold mb-16 font-mono flex items-center gap-4"
    >
      <span className="text-green-400 text-4xl">{number}.</span>
      <span className="text-gray-100">{title}</span>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="h-px bg-gradient-to-r from-green-500 to-transparent flex-1"
      />
    </motion.h2>
  );
}

function ExperienceCard({ exp, index, setCursorVariant }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ x: -100, opacity: 0 }}
      animate={isInView ? { x: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative pl-20 pr-4 pb-16 md:pl-24 group"
      onMouseEnter={() => setCursorVariant('hover')}
      onMouseLeave={() => setCursorVariant('default')}
    >
      {/* Timeline Dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
        className="absolute left-6 top-0 w-5 h-5 rounded-full bg-green-500 border-4 border-black z-10 hidden md:block"
      />

      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        className={`bg-gradient-to-br ${exp.color} p-[2px] rounded-2xl`}
      >
        <div className="bg-gray-900 p-8 rounded-2xl backdrop-blur-sm h-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
            <div>
              <h3 className="text-3xl font-bold text-green-400 mb-2">{exp.title}</h3>
              <p className="text-2xl text-gray-300 font-semibold">{exp.company}</p>
            </div>
            <div className="text-gray-400 font-mono text-sm mt-3 sm:mt-0 sm:text-right">
              <p className="text-green-400">{exp.period}</p>
              <p>{exp.location}</p>
            </div>
          </div>
          <ul className="space-y-3 mt-6">
            {exp.achievements.map((achievement, i) => (
              <motion.li
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: index * 0.2 + 0.4 + i * 0.1 }}
                className="flex items-start text-gray-300 text-lg"
              >
                <span className="text-green-400 mr-3 mt-1 text-xl">▹</span>
                <span>{achievement}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ project, index, setCursorVariant }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX((y - centerY) / 10);
    setRotateY((centerX - x) / 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setCursorVariant('hover')}
      className={`relative bg-gradient-to-br ${project.gradient} p-[3px] rounded-2xl overflow-hidden group cursor-pointer`}
    >
      <div className="bg-gray-900 p-8 rounded-2xl h-full backdrop-blur-sm relative z-10">
        <div className="absolute top-4 right-4 bg-black/80 px-4 py-2 rounded-lg text-sm font-bold">
          {project.highlight}
        </div>
        
        <motion.h3
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-3xl font-bold text-green-400 mb-4 mt-8"
        >
          {project.name}
        </motion.h3>
        
        <p className="text-gray-300 mb-6 text-lg leading-relaxed">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((tech, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: index * 0.2 + 0.4 + i * 0.05 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="text-sm bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/40 font-mono"
            >
              {tech}
            </motion.span>
          ))}
        </div>
        
        {project.link && (
          <motion.a
            whileHover={{ scale: 1.05, x: 10 }}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-400 font-mono text-lg font-bold hover:text-green-300 transition-colors"
          >
            Ver projeto <span>→</span>
          </motion.a>
        )}
      </div>
      
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 blur-xl"
      />
    </motion.div>
  );
}

function SkillCard({ category, items, index, setCursorVariant }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 100, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, rotate: 2 }}
      onMouseEnter={() => setCursorVariant('hover')}
      onMouseLeave={() => setCursorVariant('default')}
      className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-green-500/30 hover:border-green-500/60 transition-all shadow-lg hover:shadow-green-500/20 group cursor-pointer"
    >
      <motion.h3
        animate={{ color: ['#10b981', '#34d399', '#10b981'] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="font-mono text-xl mb-6 capitalize font-bold flex items-center gap-2"
      >
        <span className="text-2xl">
          {category === 'backend' ? '⚙️' : category === 'frontend' ? '🎨' : category === 'database' ? '💾' : '🛠️'}
        </span>
        {category}
      </motion.h3>
      <ul className="space-y-3">
        {items.map((skill, i) => (
          <motion.li
            key={i}
            initial={{ x: -30, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: index * 0.1 + i * 0.05 }}
            whileHover={{ x: 10, color: '#10b981' }}
            className="text-gray-300 flex items-center gap-2 text-base"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              className="text-green-400"
            >
              ▹
            </motion.span>
            {skill}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export default App;