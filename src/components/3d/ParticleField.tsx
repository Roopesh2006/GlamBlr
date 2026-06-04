import React, { useEffect, useRef } from 'react';

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Adjust count based on performance
    const isMobile = width < 768;
    const particleCount = isMobile ? 50 : 150;

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      phase: number;
      phaseSpeed: number;
      color: string;
    }

    const particles: Particle[] = [];
    // Color psychology palette: gold, rose, sage green, and sapphire blue beads
    const colors = [
      'rgba(160, 125, 26, 0.4)', // Warm gold
      'rgba(181, 75, 94, 0.3)',  // Dusty rose
      'rgba(46, 139, 87, 0.25)', // Sage green
      'rgba(30, 63, 102, 0.25)'  // Sapphire blue
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.8 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: -0.05 - Math.random() * 0.18, // elegant, extremely slow upward drift
        opacity: 0.15 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.003 + Math.random() * 0.012,
        color: colors[i % colors.length]
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.phase += p.phaseSpeed;

        // Wrap around screens smoothly
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Pulse opacity
        const currentOpacity = p.opacity * (0.55 + 0.45 * Math.sin(p.phase));

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        // Warm sparkling light psychology colors
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 block bg-transparent"
    />
  );
}
