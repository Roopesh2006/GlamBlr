import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles, Sun, Moon, Compass, ChevronDown, Layers, MapPin, Eye, MousePointerClick, Heart } from 'lucide-react';
import * as THREE from 'three';

interface SalonLobbyProps {
  appDarkMode: boolean;
  onToggleDarkMode?: () => void;
}

// -------------------------------------------------------------
// R3F SUB-COMPONENT: ANIMATING SHAPES, CAMERA, AND ATMOSPHERES
// -------------------------------------------------------------
function TourScene({ 
  scrollRatio, 
  darkMode, 
  forcedAtmosphere 
}: { 
  scrollRatio: number; 
  darkMode: boolean; 
  forcedAtmosphere: string | null 
}) {
  const { camera } = useThree();
  const flaconRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const lobbyRef = useRef<THREE.Group>(null);
  const atmosphereLightRef = useRef<THREE.PointLight>(null);

  // Determine active atmosphere aesthetic based on either scroll ratio or forcing override
  const activeAero = useMemo(() => {
    if (forcedAtmosphere) return forcedAtmosphere;
    if (scrollRatio < 0.25) return 'diagnostics';
    if (scrollRatio < 0.50) return 'spa';
    if (scrollRatio < 0.75) return 'grooming';
    return 'bridal';
  }, [scrollRatio, forcedAtmosphere]);

  // Color mappings for different service aesthetics
  const aeroConfig = useMemo(() => {
    switch (activeAero) {
      case 'diagnostics':
        return {
          color: '#A07D1A', // Gold
          emissive: '#5C4405',
          intensity: 3.5,
          desc: 'Prestige & Diagnostic Formulation'
        };
      case 'spa':
        return {
          color: '#0EA5E9', // Water blue
          emissive: '#034E75',
          intensity: 4.0,
          desc: 'Calm Healing & Deep Decompression'
        };
      case 'grooming':
        return {
          color: '#EAB308', // Warm Amber Gold
          emissive: '#6B4E02',
          intensity: 4.5,
          desc: 'Refinement & Executive Shaves'
        };
      case 'bridal':
      default:
        return {
          color: '#EC4899', // Dusty pink
          emissive: '#7F1D1D',
          intensity: 4.0,
          desc: 'Celebration & Sacred Glam'
        };
    }
  }, [activeAero]);

  // Interpolate camera and meshes positioning frame-by-frame
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. Camera LERP transition based on scroll ratio
    // Stage 0: Close-up on product flacon at [0, 1.3, 3.8] lookAt [0, 0, 0]
    // Stage 1: Zoom out to see wide lobby at [5, 6, 7] lookAt [0, -0.6, 0]
    const targetCamX = THREE.MathUtils.lerp(0, 5, scrollRatio);
    const targetCamY = THREE.MathUtils.lerp(1.5, 5.5, scrollRatio);
    const targetCamZ = THREE.MathUtils.lerp(3.8, 6.5, scrollRatio);

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.08);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.08);

    const lookTargetY = THREE.MathUtils.lerp(0, -0.8, scrollRatio);
    camera.lookAt(0, lookTargetY, 0);

    // 2. Animate diagnostic perfume flacon (rotation and floating heights)
    if (flaconRef.current) {
      flaconRef.current.rotation.y += 0.01;
      // Hover flacon gently
      const hoverHeight = Math.sin(t * 1.5) * 0.12 - (scrollRatio * 1.8);
      flaconRef.current.position.y = THREE.MathUtils.lerp(flaconRef.current.position.y, hoverHeight, 0.1);
      
      // Scale down structure as we reveal lobby interior
      const scaleFactor = Math.max(0.2, 1 - (scrollRatio * 1.1));
      flaconRef.current.scale.setScalar(scaleFactor);
    }

    // Spin diagnostic orbital rings
    if (ringRef1.current) {
      ringRef1.current.rotation.x = t * 0.4;
      ringRef1.current.rotation.y = t * 0.2;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y = -t * 0.5;
      ringRef2.current.rotation.z = t * 0.35;
    }

    // 3. Lobby interior appearance (lerps up from the bottom ground)
    if (lobbyRef.current) {
      const lobbyTargetY = THREE.MathUtils.lerp(-4, -1, scrollRatio);
      lobbyRef.current.position.y = THREE.MathUtils.lerp(lobbyRef.current.position.y, lobbyTargetY, 0.1);
    }

    // 4. Atmosphere light pulsing colors
    if (atmosphereLightRef.current) {
      const targetColor = new THREE.Color(aeroConfig.color);
      atmosphereLightRef.current.color.lerp(targetColor, 0.1);
    }
  });

  // Base materials configuration depending on light vs dark mode
  const baseFloorColor = darkMode ? '#12121E' : '#FFFFFF';
  const chairBaseColor = darkMode ? '#2B2B38' : '#FAF6F0';
  const metallicTrimColor = '#D4AF37'; // Brushed Gold is constant for couture theme

  return (
    <>
      {/* Dynamic Background Fog & Backdrop Color */}
      <color attach="background" args={[darkMode ? '#0B0B13' : '#FAF7F1']} />
      <ambientLight intensity={darkMode ? 0.35 : 0.85} color={darkMode ? '#4338CA' : '#FAF6F0'} />

      {/* Primary directional sun casting soft golden beams */}
      <directionalLight position={[4, 10, 4]} intensity={darkMode ? 0.8 : 1.3} color="#FFFBF0" />
      
      {/* Shifting Atmosphere Point Light */}
      <pointLight 
        ref={atmosphereLightRef}
        position={[0, 1.2, 0.5]} 
        intensity={aeroConfig.intensity} 
        distance={10} 
      />

      <pointLight position={[3, -1.5, 3]} intensity={1.5} color={aeroConfig.color} />

      {/* -------------------------------------------------------------
          VIEWPORT COMPONENT A: MAIN DIAGNOSTIC PERFUME FLACON
          ------------------------------------------------------------- */}
      <group ref={flaconRef}>
        {/* Crystal Bottle Core base */}
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.9, 1.2, 0.9]} />
          <meshPhysicalMaterial 
            color="#FCFAF6" 
            roughness={0.05} 
            metalness={0.1} 
            transmission={0.88} 
            thickness={1.2}
            clearcoat={1.0}
            attenuationColor="#A07D1A"
          />
        </mesh>

        {/* Flacon Serum fluid levels inside mirror */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.86, 16]} />
          <meshStandardMaterial 
            color={aeroConfig.color}
            roughness={0.15}
            metalness={0.1}
            emissive={aeroConfig.emissive}
            opacity={0.85}
            transparent
          />
        </mesh>

        {/* Golden atomiser dispenser collar */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.25, 24]} />
          <meshStandardMaterial 
            color={metallicTrimColor} 
            roughness={0.18} 
            metalness={0.8} 
          />
        </mesh>

        {/* Crown Cap cover */}
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[0.42, 0.35, 0.42]} />
          <meshPhysicalMaterial 
            color="#FCFAF6"
            transmission={0.9}
            thickness={0.8}
            roughness={0.02}
          />
        </mesh>

        {/* Inner golden spray pipet stem */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.85, 8]} />
          <meshStandardMaterial color={metallicTrimColor} metalness={0.8} />
        </mesh>

        {/* Orbit diagnostic concentric rings */}
        <mesh ref={ringRef1}>
          <torusGeometry args={[1.4, 0.02, 8, 48]} />
          <meshStandardMaterial color={aeroConfig.color} emissive={aeroConfig.color} opacity={0.5} transparent />
        </mesh>
        <mesh ref={ringRef2}>
          <torusGeometry args={[1.7, 0.015, 8, 48]} />
          <meshStandardMaterial color={metallicTrimColor} opacity={0.35} transparent />
        </mesh>
      </group>


      {/* -------------------------------------------------------------
          VIEWPORT COMPONENT B: STYLIZED LOW-POLY SALON LOBBY INTERIOR
          ------------------------------------------------------------- */}
      <group ref={lobbyRef} position={[0, -4, 0]}>
        
        {/* Luxury Cashmere / Alabaster Floor Platform */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[6.5, 0.25, 6.5]} />
          <meshStandardMaterial color={baseFloorColor} roughness={0.3} metalness={0.05} />
        </mesh>

        {/* Glowing Matrix under-lip panel */}
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[6.7, 0.1, 6.7]} />
          <meshStandardMaterial color={aeroConfig.color} emissive={aeroConfig.color} opacity={0.6} transparent />
        </mesh>

        {/* Low-Poly Luxury Partition Wall (Backside Grid) */}
        <mesh position={[-3.1, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[6.0, 3.8, 0.15]} />
          <meshStandardMaterial color={darkMode ? '#1E1E2C' : '#F5F1E9'} roughness={0.7} />
        </mesh>

        {/* Gold Architectural Trim Accents */}
        <mesh position={[-3.0, 1.8, 1.5]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.1, 3.8, 0.2]} />
          <meshStandardMaterial color={metallicTrimColor} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-3.0, 1.8, -1.5]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.1, 3.8, 0.2]} />
          <meshStandardMaterial color={metallicTrimColor} metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Mirror Console - Panel Base */}
        <mesh position={[-2.95, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.5, 0.9, 0.4]} />
          <meshStandardMaterial color={chairBaseColor} roughness={0.4} />
        </mesh>

        {/* High-Contrast Arch Mirror with LED backlights */}
        <mesh position={[-2.92, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.2, 1.5, 0.06]} />
          <meshStandardMaterial 
            color="#FCFAF6" 
            emissive={aeroConfig.color}
            emissiveIntensity={0.6}
            roughness={0.01}
          />
        </mesh>

        {/* Mirror Reflection Glass Pane */}
        <mesh position={[-2.90, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.0, 1.4, 0.02]} />
          <meshPhysicalMaterial 
            color="#EAEFF5" 
            transmission={0.6} 
            thickness={0.2}
            roughness={0.05} 
            metalness={0.9}
          />
        </mesh>

        {/* Stylist Master Chair A (Luxurious box architecture) */}
        <group position={[-1.2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          {/* Chrome Hydralic Base Column */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
            <meshStandardMaterial color={metallicTrimColor} metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.04, 16]} />
            <meshStandardMaterial color={metallicTrimColor} metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Seat Cushion */}
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.7, 0.15, 0.65]} />
            <meshStandardMaterial color={darkMode ? '#1B1410' : '#4E443C'} roughness={0.6} />
          </mesh>

          {/* Curved Backrest */}
          <mesh position={[-0.32, 0.85, 0]}>
            <boxGeometry args={[0.1, 0.65, 0.65]} />
            <meshStandardMaterial color={darkMode ? '#241b16' : '#5C534C'} roughness={0.6} />
          </mesh>

          {/* Comfortable Armrests */}
          <mesh position={[0, 0.65, 0.32]}>
            <boxGeometry args={[0.65, 0.24, 0.08]} />
            <meshStandardMaterial color={metallicTrimColor} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.65, -0.32]}>
            <boxGeometry args={[0.65, 0.24, 0.08]} />
            <meshStandardMaterial color={metallicTrimColor} metalness={0.8} />
          </mesh>
        </group>

        {/* Japanese Scalp Healing Water Basin (At the right quadrant) */}
        <group position={[1.5, 0, -1.5]}>
          {/* Ceramic Basin Pillar */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.42, 0.35, 0.8, 12]} />
            <meshStandardMaterial color={chairBaseColor} roughness={0.1} />
          </mesh>
          {/* Glimmering water surface */}
          <mesh position={[0, 0.81, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.38, 16]} />
            <meshStandardMaterial 
              color="#0EA5E9" 
              emissive="#0EA5E9" 
              emissiveIntensity={activeAero === 'spa' ? 0.9 : 0.2} 
              roughness={0.02} 
            />
          </mesh>

          {/* Golden overhead circular steam compressor frame */}
          <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.45, 0.04, 8, 24]} />
            <meshStandardMaterial color={metallicTrimColor} metalness={0.8} />
          </mesh>
        </group>

        {/* Private Bridal Boudoir Traditional Room partition screen (Far corner) */}
        <group position={[1.8, 0, 1.8]} rotation={[0, -Math.PI / 4, 0]}>
          {/* Elegant gold mesh framework */}
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[1.5, 2.8, 0.08]} />
            <meshStandardMaterial 
              color={metallicTrimColor} 
              roughness={0.1}
              metalness={0.9}
              wireframe={true}
            />
          </mesh>
          
          {/* Sabyasachi rose textile drape screen backing */}
          <mesh position={[0, 1.5, -0.01]}>
            <boxGeometry args={[1.35, 2.5, 0.02]} />
            <meshStandardMaterial 
              color="#B54B5E" 
              roughness={0.9} 
              opacity={activeAero === 'bridal' ? 0.95 : 0.6}
              transparent
            />
          </mesh>
        </group>

        {/* Luxury Pedestal styling floral vase element */}
        <group position={[-1.6, 0, 1.8]}>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.18, 0.22, 0.9, 12]} />
            <meshStandardMaterial color={chairBaseColor} roughness={0.2} />
          </mesh>
          {/* Glowing floral crystal bloom */}
          <mesh position={[0, 0.95, 0]}>
            <dodecahedronGeometry args={[0.16]} />
            <meshStandardMaterial 
              color={aeroConfig.color} 
              emissive={aeroConfig.color}
              emissiveIntensity={0.8} 
            />
          </mesh>
        </group>

        {/* Decorative dynamic floating particles in standard React Fiber */}
        <group position={[0, 1.2, 0]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh 
              key={i} 
              position={[
                Math.sin(i * 1.5) * 1.8, 
                Math.cos(i * 2.1) * 0.9, 
                Math.sin(i * 0.8) * 1.8
              ]}
            >
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color={aeroConfig.color} />
            </mesh>
          ))}
        </group>

        {/* Ambient Grid Lines beneath the salon floor to fit 'Holographic' theme */}
        <gridHelper args={[14, 14, '#D4AF37', darkMode ? 'rgba(212,175,55,0.08)' : 'rgba(212,175,55,0.18)']} position={[0, -0.3, 0]} />
      </group>
    </>
  );
}

// -------------------------------------------------------------
// MAIN COMPONENT EXPORT HOLDING CONTROLS, SCROLL & INTERACTIVE PANEL
// -------------------------------------------------------------
export default function SalonLobby({ appDarkMode, onToggleDarkMode }: SalonLobbyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Self-contained scroll tracking ratio specifically inside this viewport
  const [scrollRatio, setScrollRatio] = useState(0);

  // Forced Atmosphere override for clicking around manual options
  const [forcedAtmosphere, setForcedAtmosphere] = useState<string | null>(null);

  // State to track scroll depth within the specific viewport bounds
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start calculating once container bottom enters the screen and complete once container top passes off-screen
      const totalScrollableHeight = rect.height - windowHeight;
      if (totalScrollableHeight <= 0) return;

      const relativeScrolled = -rect.top;
      let ratio = relativeScrolled / totalScrollableHeight;
      ratio = Math.max(0, Math.min(1, ratio));
      setScrollRatio(ratio);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // First trigger initial measurement
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync scroll stages with beautiful human-readable descriptions
  const activeStageDetails = useMemo(() => {
    if (forcedAtmosphere) {
      switch (forcedAtmosphere) {
        case 'diagnostics':
          return {
            title: 'Diagnostic Oil flacon',
            sub: 'Stage 1 of 4 • Aroma & Clinic Intake',
            desc: 'Analyze hair density patterns and extract organic clinical serum components before custom matching Star Stylists.'
          };
        case 'spa':
          return {
            title: 'MedSpa Japanese HeadBasin',
            sub: 'Stage 2 of 4 • Cognitive Decompression',
            desc: 'Steam infused water compression rings and deep herbal scrubs. Complete mental rejuvenation verified by Sabyasachi legends.'
          };
        case 'grooming':
          return {
            title: 'Executive Grooming Bar',
            sub: 'Stage 3 of 4 • Sandalwood razor sculpts',
            desc: 'Italian luxury shaving recliners, gold-plated contours and precision hair aesthetics designed to reflect high social prestige.'
          };
        case 'bridal':
        default:
          return {
            title: 'Sacred Bridal Boudoir',
            sub: 'Stage 4 of 4 • Heirloom Saree Lounge',
            desc: 'Exclusive private bridal styling decks, heavy gold glow skin facials, and airbrush cosmetics fitted to ancestral draping art.'
          };
      }
    }

    if (scrollRatio < 0.25) {
      return {
        title: 'Diagnostic flacon Capsule',
        sub: 'Stage 1 of 4 • Scroll to Assemble Lobby ⏬',
        desc: 'Spinning glass flacon displaying clinical serum blends. This represents the diagnostic stage matching matching follicles.'
      };
    } else if (scrollRatio < 0.50) {
      return {
        title: 'Japanese HeadBasin Deck',
        sub: 'Stage 2 of 4 • Cognitive Healing',
        desc: 'Reveal room interiors! Safe, sterile steam thermal wash basins aligned to Dr. Kritika S’s scalp diagnostic tracking.'
      };
    } else if (scrollRatio < 0.75) {
      return {
        title: 'Executive Grooming Lounge',
        sub: 'Stage 3 of 4 • Prestigious Shaving',
        desc: 'Vibrant whiskey gold lighting highlighting premium Italian lounge chairs, deep pore detoxins and beard sculpts.'
      };
    } else {
      return {
        title: 'Sacred Bridal Boudoir',
        sub: 'Stage 4 of 4 • Sacred Heritage Glam',
        desc: 'Deep magenta draping screens and vintage dress forms. The final step where heirloom jewelry meets modern HD aesthetics.'
      };
    }
  }, [scrollRatio, forcedAtmosphere]);

  return (
    <div 
      ref={containerRef} 
      id="scroll_hologram_tour_section"
      className="relative w-full min-h-[180vh] flex flex-col items-stretch"
    >
      
      {/* Sticky Canvas Viewport holding the R3F Canvas */}
      <div className="sticky top-0 left-0 right-0 h-screen w-full overflow-hidden flex flex-col justify-between p-6 z-10 select-none">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px]" />
        </div>

        {/* STICKY TOPBAR: Title and Dark / Light button */}
        <div className="relative z-20 flex items-center justify-between max-w-7xl mx-auto w-full border-b border-[#E1DBCE]/60 pb-4 bg-transparent mt-24">
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#A07D1A] text-white font-mono text-[9px] font-bold rounded-md tracking-wider uppercase">
                ✦ LIVE COUTURE 3D
              </span>
              <span className="text-[10px] text-[#A07D1A] font-mono tracking-widest font-bold uppercase">
                SCROLL-TRIGGERED RADAR
              </span>
            </div>
            <h3 className="font-serif italic text-xl md:text-3xl font-bold text-[#1E1A17] dark:text-[#FAF6F0] leading-tight">
              Interactive Holographic Tour
            </h3>
          </div>

          <div className="flex items-center gap-2.5">
            {/* DARK / LIGHT THEME SWITCH */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                id="3d_theme_toggle_btn"
                title={appDarkMode ? "Switch to Royal Cashmere Light Mode" : "Switch to Black Velvet Dark Mode"}
                className={`p-3.5 rounded-full border cursor-pointer transition-all flex items-center justify-center shadow-xs ${
                  appDarkMode 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                    : 'bg-indigo-50 border-indigo-200 text-indigo-900 hover:bg-indigo-100'
                }`}
              >
                {appDarkMode ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-indigo-900" />}
              </button>
            )}

            {/* Manual Scroll indicator */}
            <div className="hidden sm:flex flex-col items-end text-right font-mono text-[10px] text-slate-400">
              <span className="font-extrabold text-[#A07D1A]">SCROLL INDEX</span>
              <span>{Math.round(scrollRatio * 100)}% DETECTED</span>
            </div>
          </div>
        </div>

        {/* THE MAIN THREE.JS CANVAS */}
        <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing">
          <Canvas dpr={[1, 2]} camera={{ position: [0, 1.5, 3.8], fov: 45 }}>
            <TourScene 
              scrollRatio={scrollRatio} 
              darkMode={appDarkMode} 
              forcedAtmosphere={forcedAtmosphere} 
            />
          </Canvas>
        </div>

        {/* BOTTOM HUD INTERFACE PANEL OVERLAY */}
        <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-end pb-12 mt-auto text-left">
          
          {/* HUD COLUMN 1: Detailed scroll description block */}
          <div className="md:col-span-7 bg-[#FAF7F1]/95 dark:bg-[#0F101A]/95 p-6 rounded-2xl border border-[#E1DBCE] dark:border-indigo-950/60 shadow-lg space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>{activeStageDetails.sub}</span>
              <span className="uppercase tracking-widest font-extrabold text-[#A07D1A] animate-pulse">
                🟢 REAL-TIME GRAPHICS
              </span>
            </div>

            <h4 className="font-serif italic text-xl md:text-2xl font-bold text-[#1E1A17] dark:text-[#FCFAF6] leading-none">
              {activeStageDetails.title}
            </h4>

            <p className="text-xs text-[#5C534C] dark:text-slate-300 leading-relaxed">
              {activeStageDetails.desc}
            </p>

            <div className="h-0.5 bg-slate-200/50 dark:bg-slate-800" />

            {/* Scroll navigation helper instructions */}
            <div className="flex items-center justify-between text-[9px] text-[#A07D1A] font-mono tracking-wider font-extrabold">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 animate-spin-slow text-[#A07D1A]" />
                SCROLL DOWN TO DEPLOY 3D PLAN OR CHOOSE DIRECTLY
              </span>
              {forcedAtmosphere && (
                <button 
                  onClick={() => setForcedAtmosphere(null)} 
                  className="underline cursor-pointer border border-[#A07D1A]/20 px-2 py-0.5 rounded bg-white"
                >
                  Clear Forcing Array
                </button>
              )}
            </div>
          </div>

          {/* HUD COLUMN 2: Manual Diagnostic Override panel */}
          <div className="md:col-span-5 bg-white dark:bg-[#121222] p-5 rounded-2xl border border-[#E1DBCE]/90 dark:border-indigo-950/40 shadow-md space-y-3 text-left">
            <span className="text-[10px] font-mono text-[#A07D1A] dark:text-amber-400 font-extrabold tracking-widest block uppercase">
              🎛️ Manual Atmosphere Override
            </span>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">
              Directly shift the 3D hologram projector to match service moods. Try toggling for quick clinical ambiance previews.
            </p>

            {/* Manual Atmosphere Selection Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'diagnostics', name: '🧪 Diagnostics', color: 'border-amber-500 text-[#805C06] dark:text-amber-300' },
                { id: 'spa', name: '💧 Japanese Spa', color: 'border-sky-500 text-sky-800 dark:text-sky-300' },
                { id: 'grooming', name: '🧔 Grooming Bar', color: 'border-amber-600 text-amber-800 dark:text-amber-200' },
                { id: 'bridal', name: '👑 Bridal Salon', color: 'border-pink-500 text-pink-700 dark:text-pink-300' }
              ].map((btn) => {
                const isSelected = forcedAtmosphere === btn.id || (!forcedAtmosphere && (
                  (btn.id === 'diagnostics' && scrollRatio < 0.25) ||
                  (btn.id === 'spa' && scrollRatio >= 0.25 && scrollRatio < 0.5) ||
                  (btn.id === 'grooming' && scrollRatio >= 0.5 && scrollRatio < 0.75) ||
                  (btn.id === 'bridal' && scrollRatio >= 0.75)
                ));
                return (
                  <button
                    key={btn.id}
                    onClick={() => setForcedAtmosphere(btn.id)}
                    className={`p-2 rounded-xl text-[11px] font-semibold text-left border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? `bg-[#FAF6F0] dark:bg-slate-800/80 ${btn.color} font-bold ring-2 ring-[#A07D1A]/10 scale-102`
                        : 'bg-white/40 dark:bg-[#1A1A2A]/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span>{btn.name}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#A07D1A] animate-ping" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Spacer panels inside scroll stream to trigger bounding scroll offsets */}
      <div className="h-screen w-full pointer-events-none select-none" />
      <div className="h-xs w-full pointer-events-none select-none" />
    </div>
  );
}
