import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Droplet, MapPin, Activity, X, ArrowDown, ShoppingBag, Star, Zap, ChevronRight, Maximize2 } from 'lucide-react';

// Utility for smooth mouse tracking
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
  return mousePosition;
};

const NoiseBackground = () => (
  <div 
    className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay opacity-20"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

const AmbientLight = ({ color = "rgba(217,119,6,0.15)", size = "50vw", top = "50%", left = "50%" }) => (
  <div 
    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
    style={{
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      width: size,
      height: size,
      top,
      left,
      zIndex: 0
    }}
  />
);

const GlassCard = ({ children, className = "", style = {} }) => (
  <div 
    className={`bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden ${className}`}
    style={style}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
    {children}
  </div>
);

const MagneticButton = ({ children, onClick, className = "" }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative px-6 py-3 rounded-full flex items-center justify-center gap-2 group overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-amber-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
      <span className="relative z-10 flex items-center gap-2 text-sm tracking-widest uppercase font-medium">
        {children}
      </span>
    </motion.button>
  );
};

const Navigation = () => {
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-40 px-6 py-6 flex justify-between items-center pointer-events-none"
    >
      <div className="pointer-events-auto mix-blend-difference">
        <a 
          href="#hero" 
          onClick={(e) => handleNavClick(e, 'hero')} 
          className="text-3xl font-light tracking-[0.2em] text-white"
        >
          ÒRÓ
        </a>
      </div>
      
      <div className="hidden md:flex gap-8 pointer-events-auto mix-blend-difference">
        {['COLLECTION', 'STORY', 'CONTACT'].map((item) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase()}`} 
            onClick={(e) => handleNavClick(e, item.toLowerCase())}
            className="text-xs text-white/70 tracking-widest hover:text-amber-500 transition-colors"
          >
            {item}
          </a>
        ))}
      </div>

      <div className="pointer-events-auto mix-blend-difference">
        <button className="flex flex-col gap-1.5 p-2 group">
          <span className="block w-6 h-px bg-white group-hover:bg-amber-500 transition-colors" />
          <span className="block w-4 h-px bg-white group-hover:bg-amber-500 transition-colors" />
        </button>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  const { x, y } = useMousePosition();
  
  // Parallax for bottle based on mouse
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const xOffset = (x - windowWidth / 2) / 50;
  const yOffset = (y - windowHeight / 2) / 50;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
  };

  const bottleVariants = {
    hidden: { scale: 0.8, opacity: 0, filter: 'blur(20px)' },
    show: { scale: 1, opacity: 1, filter: 'blur(0px)', transition: { duration: 2, ease: "easeOut" } }
  };

  const glowVariants = {
    hidden: { scale: 0, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: { duration: 2, ease: "easeOut" } }
  };

  return (
    <motion.section 
      id="hero"
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#030303]"
    >
      {/* Dynamic Ambient Lighting */}
      <motion.div variants={glowVariants} className="absolute inset-0 z-0 flex items-center justify-center">
        <AmbientLight color="rgba(217, 119, 6, 0.25)" size="80vw" />
        <AmbientLight color="rgba(250, 204, 21, 0.1)" size="40vw" />
      </motion.div>

      {/* Central Perfume Bottle */}
      <motion.div 
        className="relative z-10 w-full max-w-[400px] aspect-[3/4] md:max-w-[500px]"
        animate={{ x: xOffset, y: yOffset }}
        transition={{ type: "spring", damping: 50, stiffness: 100 }}
      >
        <motion.div 
          variants={bottleVariants}
          animate={{ y: [-15, 15] }}
          transition={{ repeat: Infinity, duration: 4, repeatType: "reverse", ease: "easeInOut" }}
          className="w-full h-full relative"
        >
          {/* Abstract stylized bottle representation using CSS filters on a generic glass image to look premium and unique */}
          <img 
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop" 
            alt="Oro Perfume Bottle" 
            className="w-full h-full object-contain mix-blend-lighten opacity-90"
            style={{ filter: 'grayscale(50%) sepia(40%) hue-rotate(350deg) contrast(150%) brightness(80%) drop-shadow(0 0 40px rgba(217,119,6,0.4))' }}
          />
        </motion.div>
      </motion.div>

      {/* Center Typographic Overlays */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <h2 className="text-[15vw] md:text-[12vw] font-bold tracking-tighter leading-none text-white/5 mix-blend-overlay flex overflow-hidden">
          {['Ò', 'R', 'Ó'].map((char, i) => (
            <motion.span 
              key={i} 
              variants={{ hidden: { opacity: 0, y: 100 }, show: { opacity: 1, y: 0, transition: { duration: 1, ease: "backOut" } } }}
              className="block"
            >
              {char}
            </motion.span>
          ))}
        </h2>
        
        <motion.div variants={itemVariants} className="absolute bottom-[15%] md:bottom-[10%] flex flex-col items-center gap-6 pointer-events-auto">
          <p className="text-amber-500 tracking-[0.3em] text-xs md:text-sm font-medium uppercase">A scent that stays.</p>
          <div className="flex gap-4">
            <MagneticButton className="bg-white text-black border border-transparent">
              Explore Scent
            </MagneticButton>
            <MagneticButton className="border border-white/20 text-white hover:bg-white/5">
              Shop Collection
            </MagneticButton>
          </div>
        </motion.div>
      </div>

      {/* Floating UI Cards */}
      <div className="absolute inset-0 z-30 pointer-events-none p-6 md:p-12">
        
        {/* Top Left Card */}
        <motion.div variants={itemVariants} className="absolute top-[20%] left-[5%] md:left-[15%] pointer-events-auto hidden md:block transform -rotate-2">
          <GlassCard className="p-4 w-40">
            <div className="flex items-center gap-2 text-amber-500 mb-2">
              <Droplet size={14} />
              <span className="text-[10px] tracking-widest font-bold">CONCENTRATION</span>
            </div>
            <div className="text-3xl font-light text-white tracking-tighter">30%</div>
            <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ delay: 1.5, duration: 1.5, ease: "circOut" }}
                className="h-full bg-amber-500 rounded-full" 
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Top Right Card */}
        <motion.div variants={itemVariants} className="absolute top-[25%] right-[5%] md:right-[15%] pointer-events-auto transform rotate-3">
          <GlassCard className="p-4 w-48">
            <div className="flex items-center gap-2 text-amber-500 mb-2">
              <MapPin size={14} />
              <span className="text-[10px] tracking-widest font-bold">ORIGIN</span>
            </div>
            <div className="text-xl font-medium text-white tracking-widest">NIGERIA 🇳🇬</div>
            <p className="text-xs text-white/50 mt-1">Crafted in Lagos</p>
          </GlassCard>
        </motion.div>

        {/* Bottom Left Card */}
        <motion.div variants={itemVariants} className="absolute bottom-[25%] left-[5%] md:left-[10%] pointer-events-auto transform rotate-1">
          <GlassCard className="p-5 w-56">
            <div className="flex items-center gap-2 text-amber-500 mb-3">
              <Activity size={14} />
              <span className="text-[10px] tracking-widest font-bold">PROFILE</span>
            </div>
            <div className="flex flex-col gap-2">
              {[ {name: "WOODY", val: "82%"}, {name: "AMBER", val: "68%"}, {name: "MUSK", val: "41%"} ].map(note => (
                <div key={note.name} className="flex items-center justify-between text-xs text-white">
                  <span className="tracking-wider">{note.name}</span>
                  <span className="text-white/50">{note.val}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Bottom Right Small Indicator */}
        <motion.div variants={itemVariants} className="absolute bottom-[30%] right-[10%] md:right-[20%] pointer-events-auto hidden md:flex transform -rotate-3">
          <GlassCard className="p-3 px-4 flex-col items-center gap-1 border-amber-500/30">
            <span className="text-[10px] tracking-widest text-amber-500">LONGEVITY</span>
            <div className="flex gap-1 text-amber-400">
              {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="currentColor" />)}
            </div>
          </GlassCard>
        </motion.div>

      </div>

      {/* Scroll Indicator */}
      <motion.div variants={itemVariants} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 z-20 pointer-events-none">
        <span className="text-[10px] tracking-widest">SCROLL</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

const StoryScroll = () => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const text1Scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.5]);
  const text1Opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const text1Blur = useTransform(scrollYProgress, [0, 0.5], ["blur(0px)", "blur(10px)"]);

  const text2Scale = useTransform(scrollYProgress, [0.5, 1], [0.8, 1]);
  const text2Opacity = useTransform(scrollYProgress, [0.6, 1], [0, 1]);
  const text2Blur = useTransform(scrollYProgress, [0.5, 1], ["blur(10px)", "blur(0px)"]);
  
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.1, 0.5]);

  return (
    <section id="story" ref={containerRef} className="relative w-full h-[200vh] bg-[#050505]">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.4),transparent_70%)]" 
          style={{ opacity: bgOpacity }}
        />
        
        <motion.div 
          className="absolute inset-0 flex items-center justify-center px-4 text-center"
          style={{ scale: text1Scale, opacity: text1Opacity, filter: text1Blur }}
        >
          <h2 className="text-4xl md:text-7xl font-light text-white tracking-tighter w-full">
            BORN IN <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200">NIGERIA.</span>
          </h2>
        </motion.div>

        <motion.div 
          className="absolute inset-0 flex items-center justify-center px-4 text-center pointer-events-none"
          style={{ scale: text2Scale, opacity: text2Opacity, filter: text2Blur }}
        >
          <h2 className="text-4xl md:text-7xl font-light text-white tracking-tighter w-full">
            CRAFTED FOR <span className="font-bold">EVERYWHERE.</span>
          </h2>
        </motion.div>
      </div>
    </section>
  );
};

const ScentNotes = () => {
  const notes = [
    { id: '01', title: 'BERGAMOT', subtitle: 'Fresh • Bright', desc: 'A sparkling citrus opening that awakens the senses, hand-selected for optimal brightness.', img: 'https://i.ibb.co/0jHg44QF/0b2a8409dd15f19a0f8f81f77d1dba0f.jpg' },
    { id: '02', title: 'JASMINE', subtitle: 'Floral • Elegant', desc: 'Night-blooming jasmine provides a creamy, intoxicating heart to the fragrance profile.', img: 'https://i.ibb.co/prnYByxZ/0a9e09df3397b923dcadbaca687f9e56.jpg' },
    { id: '03', title: 'OUD', subtitle: 'Deep • Warm', desc: 'A rich, resinous base that anchors the scent, ensuring it lingers on the skin for hours.', img: 'https://i.ibb.co/JWXfJ3gc/46a56df7371b5da7c4e42848a2cd69be.jpg' }
  ];

  return (
    <section className="relative w-full min-h-screen bg-[#030303] py-32 px-6 overflow-hidden">
      <AmbientLight color="rgba(255,255,255,0.05)" top="20%" left="20%" />
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-20 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-8">
          <div>
            <h3 className="text-amber-500 tracking-[0.3em] text-xs font-bold mb-4">THE ANATOMY</h3>
            <h2 className="text-4xl md:text-6xl text-white font-light tracking-tighter">SCENT PROFILE</h2>
          </div>
          <p className="text-white/40 text-sm max-w-xs mt-6 md:mt-0">Carefully layered notes designed to evolve over time, revealing different facets of the composition.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {notes.map((note, idx) => (
            <motion.div
              key={note.id}
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="relative h-[400px] rounded-2xl overflow-hidden cursor-pointer group"
            >
              {/* Background Image that reveals on hover - changed base opacity so images are visible */}
              <motion.div 
                variants={{ rest: { scale: 1.2, opacity: 0.15, filter: 'grayscale(100%)' }, hover: { scale: 1, opacity: 0.6, filter: 'grayscale(0%) sepia(20%)' } }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${note.img})` }}
              />
              
              {/* Glass Card Base */}
              <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-md border border-white/[0.05] group-hover:bg-amber-900/20 group-hover:border-amber-500/30 transition-colors duration-500 z-10" />

              {/* Content */}
              <div className="relative z-20 h-full p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-white/30 font-light text-2xl group-hover:text-amber-500 transition-colors duration-500">{note.id}</span>
                  <motion.div variants={{ rest: { opacity: 0, scale: 0 }, hover: { opacity: 1, scale: 1 } }}>
                    <Zap size={16} className="text-amber-400" />
                  </motion.div>
                </div>

                <div>
                  <h4 className="text-2xl text-white tracking-widest font-medium mb-1">{note.title}</h4>
                  <p className="text-amber-500 text-sm tracking-widest mb-6">{note.subtitle}</p>
                  
                  <motion.div 
                    variants={{ rest: { height: 0, opacity: 0 }, hover: { height: 'auto', opacity: 1 } }}
                    className="overflow-hidden"
                  >
                    <p className="text-white/60 text-sm leading-relaxed border-t border-white/10 pt-4">
                      {note.desc}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductShowcase = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const products = [
    {
      id: "noir",
      name: "ÒRÓ NOIR",
      tags: "WOODY / DARK / MYSTERIOUS",
      price: "₦18,500",
      size: "30ml",
      desc: "An intense woody fragrance built around warm amber and rich oud. Designed for the bold.",
      img: "https://i.ibb.co/wrSxkpdt/4a01a733655ef6aece379e16f12ec4db.jpg",
      color: "from-neutral-900 to-black",
      accent: "text-neutral-400"
    },
    {
      id: "amber",
      name: "ÒRÓ AMBER",
      tags: "WARM / RICH / SENSUAL",
      price: "₦22,000",
      size: "50ml",
      desc: "A golden elixir capturing the warmth of the sun. Notes of vanilla, tonka, and golden resins.",
      img: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop",
      color: "from-amber-900 to-black",
      accent: "text-amber-500"
    },
    {
      id: "elan",
      name: "ÒRÓ ÉLAN",
      tags: "FRESH / CLEAN / MODERN",
      price: "₦25,000",
      size: "50ml",
      desc: "A burst of pure energy. Crisp aldehydes, white musk, and a hint of aquatic freshness.",
      img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop",
      color: "from-slate-800 to-black",
      accent: "text-blue-200"
    }
  ];

  const activeProduct = products[activeIdx];

  const handleNext = () => {
    if(!isExpanded) setActiveIdx((prev) => (prev + 1) % products.length);
  };
  
  const handlePrev = () => {
    if(!isExpanded) setActiveIdx((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <section id="collection" className="relative w-full h-screen bg-[#020202] overflow-hidden flex items-center justify-center">
      {/* Dynamic background based on active product */}
      <div className={`absolute inset-0 bg-gradient-to-b ${activeProduct.color} opacity-30 transition-colors duration-1000`} />
      <AmbientLight color="rgba(255,255,255,0.05)" size="100vw" />

      {/* Main UI Container */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 md:px-12 py-24 flex flex-col md:flex-row items-center justify-center">
        
        {/* Left/Background Carousel Items (when not expanded) */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {products.map((prod, idx) => {
                const isActive = idx === activeIdx;
                const offset = idx - activeIdx;
                const absOffset = Math.abs(offset);
                
                // Hide if too far
                if (absOffset > 1 && !(idx === 0 && activeIdx === 2) && !(idx === 2 && activeIdx === 0)) return null;

                let xPos = offset * 300;
                // Handle looping positions visually
                if (activeIdx === 0 && idx === 2) xPos = -300;
                if (activeIdx === 2 && idx === 0) xPos = 300;
                if (isActive) xPos = 0;

                return (
                  <motion.div
                    key={prod.id}
                    layoutId={`bottle-${prod.id}`}
                    animate={{ 
                      x: xPos, 
                      scale: isActive ? 1 : 0.6,
                      opacity: isActive ? 1 : 0.2,
                      filter: isActive ? 'blur(0px)' : 'blur(8px)',
                      zIndex: isActive ? 20 : 10
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="absolute w-[250px] md:w-[350px] aspect-[2/3] flex items-center justify-center"
                  >
                    <img 
                      src={prod.img} 
                      alt={prod.name}
                      className="w-full h-full object-contain mix-blend-lighten"
                      style={{ filter: isActive ? 'drop-shadow(0 0 30px rgba(255,255,255,0.1))' : 'none' }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded State View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col md:flex-row items-center justify-center gap-12 p-8 md:p-24 bg-black/60 backdrop-blur-2xl"
            >
              <button 
                onClick={() => setIsExpanded(false)}
                className="absolute top-8 right-8 text-white/50 hover:text-white bg-white/5 p-4 rounded-full border border-white/10 transition-colors"
              >
                <X size={24} />
              </button>

              <motion.div layoutId={`bottle-${activeProduct.id}`} className="w-full max-w-[400px] h-[50vh] md:h-[70vh]">
                <img 
                  src={activeProduct.img} 
                  alt={activeProduct.name}
                  className="w-full h-full object-contain mix-blend-lighten drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                />
              </motion.div>

              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-md flex flex-col gap-6"
              >
                <div className={`text-xs tracking-[0.3em] font-bold ${activeProduct.accent}`}>
                  {activeProduct.tags}
                </div>
                <h2 className="text-5xl md:text-7xl font-light text-white tracking-tighter">
                  {activeProduct.name}
                </h2>
                <div className="flex items-center gap-4 text-white/50 text-sm tracking-widest uppercase border-y border-white/10 py-4">
                  <span>{activeProduct.size}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>{activeProduct.price}</span>
                </div>
                <p className="text-white/70 leading-relaxed font-light">
                  {activeProduct.desc}
                </p>

                <div className="mt-8 flex gap-4">
                  <MagneticButton className="bg-white text-black flex-1 py-4">
                    <ShoppingBag size={18} />
                    Add to Bag
                  </MagneticButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unexpanded UI Overlay */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute z-20 bottom-12 left-0 right-0 px-6 md:px-24 flex flex-col items-center pointer-events-none"
            >
              <div className="text-center mb-8 pointer-events-auto">
                <motion.div 
                  key={activeProduct.name}
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  className={`text-[10px] tracking-[0.4em] mb-2 font-bold ${activeProduct.accent}`}
                >
                  {activeProduct.tags}
                </motion.div>
                <motion.h2 
                  key={activeProduct.id}
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                  className="text-4xl md:text-5xl font-light text-white tracking-tighter mb-4"
                >
                  {activeProduct.name}
                </motion.h2>
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="group flex items-center gap-2 mx-auto text-xs text-white/50 hover:text-white uppercase tracking-widest transition-colors"
                >
                  <Maximize2 size={14} className="group-hover:scale-110 transition-transform" />
                  View Details
                </button>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-8 pointer-events-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-2 px-6">
                <button onClick={handlePrev} className="p-2 text-white/50 hover:text-white transition-colors">
                  <ChevronRight size={20} className="rotate-180" />
                </button>
                <div className="text-sm font-mono tracking-widest text-white/80">
                  0{activeIdx + 1} <span className="text-white/20">/</span> 03
                </div>
                <button onClick={handleNext} className="p-2 text-white/50 hover:text-white transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="relative w-full py-32 px-6 bg-[#030303] flex items-center justify-center overflow-hidden">
      <AmbientLight color="rgba(250, 204, 21, 0.05)" size="60vw" top="50%" left="50%" />
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-24 items-center">
        
        <div className="flex-1 text-center md:text-left w-full">
          <h3 className="text-amber-500 tracking-[0.3em] text-xs font-bold mb-4">GET IN TOUCH</h3>
          <h2 className="text-4xl md:text-6xl text-white font-light tracking-tighter mb-6">
            DISCOVER <br className="hidden md:block" />
            THE <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200">ESSENCE.</span>
          </h2>
          <p className="text-white/40 text-sm max-w-sm mx-auto md:mx-0 leading-relaxed">
            Reach out for bespoke inquiries, wholesale opportunities, or to simply learn more about the art of Nigerian perfumery.
          </p>
          
          <div className="mt-12 flex flex-col gap-6 text-sm text-white/60 tracking-widest">
            <div className="flex items-center gap-4 justify-center md:justify-start hover:text-amber-500 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                <MapPin size={16} />
              </div>
              <p>VICTORIA ISLAND, LAGOS</p>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full">
          <GlassCard className="p-6 md:p-8 flex flex-col gap-4 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="FIRST NAME" 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-xs tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 transition-colors" 
              />
              <input 
                type="text" 
                placeholder="LAST NAME" 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-xs tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 transition-colors" 
              />
            </div>
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS" 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-xs tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 transition-colors" 
            />
            <textarea 
              placeholder="YOUR MESSAGE" 
              rows="4" 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-xs tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
            ></textarea>
            
            <button className="w-full mt-2 py-4 bg-amber-500/10 text-amber-500 text-xs font-bold tracking-[0.2em] rounded-lg border border-amber-500/20 hover:bg-amber-500 hover:text-black transition-all duration-300">
              SEND INQUIRY
            </button>
          </GlassCard>
        </div>

      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="w-full bg-black border-t border-white/5 py-12 px-6 text-center">
    <h1 className="text-4xl font-light tracking-[0.3em] text-white/20 mb-8">ÒRÓ</h1>
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-xs text-white/40 tracking-widest uppercase">
      <a href="#" className="hover:text-amber-500 transition-colors">Instagram</a>
      <span className="hidden md:block">•</span>
      <a href="#" className="hover:text-amber-500 transition-colors">Privacy</a>
      <span className="hidden md:block">•</span>
      <a href="#" className="hover:text-amber-500 transition-colors">Terms</a>
    </div>
    <p className="mt-12 text-[10px] text-white/20 uppercase tracking-widest">© 2026 ORO PERFUMES NIGERIA. A SCENT THAT STAYS.</p>
  </footer>
);

export default function App() {
  return (
    <div className="bg-black min-h-screen text-stone-50 font-sans selection:bg-amber-500/30" style={{ scrollBehavior: 'smooth' }}>
      <NoiseBackground />
      <Navigation />
      
      <main>
        <Hero />
        <StoryScroll />
        <ScentNotes />
        <ProductShowcase />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
}
