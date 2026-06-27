import { useEffect, useRef } from 'react';

interface SplashCursorProps {
  RAINBOW_MODE?: boolean;
  COLOR?: string;
  maxHeight?: number;
}

export function SplashCursor({ 
  RAINBOW_MODE = true, 
  COLOR = '#6366f1',
  maxHeight = Infinity 
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isActive = true;
    let animationId: number;

    // Setup canvas size - limit to maxHeight
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = Math.min(maxHeight, window.innerHeight);
      }
    };
    resizeCanvas();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Particle system
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
    }

    const particles: Particle[] = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let prevMouseX = -9999;
    let prevMouseY = -9999;
    let isMouseInBounds = false;

    function createParticles(x: number, y: number, count: number = 3) {
      // Only create particles if within bounds
      if (!isMouseInBounds || y > maxHeight || y < 0) return;
      
      const dx = x - prevMouseX;
      const dy = y - prevMouseY;
      const velocity = Math.sqrt(dx * dx + dy * dy);

      for (let i = 0; i < count; i++) {
        const hue = RAINBOW_MODE ? Math.random() * 360 : 250;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + velocity * 0.1;
        
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: Math.random() * 0.5 + 0.5,
          size: Math.random() * 4 + 2,
          color: `hsl(${hue}, 100%, 60%)`,
        });
      }

      // Keep particle count reasonable
      if (particles.length > 200) {
        particles.splice(0, particles.length - 200);
      }
    }

    function animate() {
      if (!isActive || !ctx || !canvas) return;

      // Fade effect
      ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Update
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life -= 0.016 / p.maxLife;

        // Remove particles that are out of bounds or dead
        if (p.life <= 0 || p.y > maxHeight || p.y < 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw
        const alpha = p.life;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2 * p.life, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    }

    function handleMouseMove(e: MouseEvent) {
      if (!canvas) return;
      
      // Calculate Y position relative to viewport top (accounting for scroll)
      const rect = canvas.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = relativeY;
      
      // Check if mouse is within canvas bounds
      isMouseInBounds = relativeY >= 0 && relativeY <= maxHeight;
      
      if (!isMouseInBounds) {
        return;
      }
      
      const dx = mouseX - prevMouseX;
      const dy = mouseY - prevMouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 2) {
        createParticles(mouseX, mouseY, Math.min(Math.floor(distance / 10), 5));
      }
    }

    function handleTouchMove(e: TouchEvent) {
      if (!canvas) return;
      
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const relativeY = touch.clientY - rect.top;
        
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = touch.clientX;
        mouseY = relativeY;
        
        // Check if touch is within canvas bounds
        isMouseInBounds = relativeY >= 0 && relativeY <= maxHeight;
        
        if (isMouseInBounds) {
          createParticles(mouseX, mouseY, 3);
        }
      }
    }

    function handleMouseLeave() {
      isMouseInBounds = false;
      mouseX = -9999;
      mouseY = -9999;
    }

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resizeCanvas);

    // Start animation
    animate();

    // Cleanup
    return () => {
      isActive = false;
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [RAINBOW_MODE, COLOR, maxHeight]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: maxHeight === Infinity ? '100%' : `${maxHeight}px`,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}
