import { useEffect, useRef, useState } from 'react';

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
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  useEffect(() => {
    // Detect low-end device
    const checkDevicePerformance = () => {
      // Check for mobile devices
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Check for low memory (if available)
      const deviceMemory = (navigator as any).deviceMemory;
      const hasLowMemory = deviceMemory && deviceMemory < 4;
      
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Check hardware concurrency (CPU cores)
      const lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      
      // Mark as low-end if mobile with low specs or user prefers reduced motion
      setIsLowEndDevice(prefersReducedMotion || (isMobile && (hasLowMemory || lowCPU)));
    };
    
    checkDevicePerformance();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isActive = true;
    let animationId: number;
    let lastFrameTime = 0;
    const targetFPS = isLowEndDevice ? 30 : 60; // Lower FPS for low-end devices
    const frameInterval = 1000 / targetFPS;

    // Setup canvas size - limit to maxHeight
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = Math.min(maxHeight, window.innerHeight);
      }
    };
    resizeCanvas();

    const ctx = canvas.getContext('2d', { 
      alpha: true,
      desynchronized: true // Better performance on some devices
    });
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

    // Adjust particle settings based on device performance
    const maxParticles = isLowEndDevice ? 80 : 200;
    const particleCountMultiplier = isLowEndDevice ? 0.5 : 1;

    function createParticles(x: number, y: number, count: number = 3) {
      // Only create particles if within bounds
      if (!isMouseInBounds || y > maxHeight || y < 0) return;
      
      const dx = x - prevMouseX;
      const dy = y - prevMouseY;
      const velocity = Math.sqrt(dx * dx + dy * dy);

      // Reduce particle count for low-end devices
      const adjustedCount = Math.ceil(count * particleCountMultiplier);

      for (let i = 0; i < adjustedCount; i++) {
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
          size: Math.random() * 3 + 1.5, // Slightly smaller particles
          color: `hsl(${hue}, 100%, 60%)`,
        });
      }

      // Keep particle count reasonable
      if (particles.length > maxParticles) {
        particles.splice(0, particles.length - maxParticles);
      }
    }

    function animate(timestamp: number) {
      if (!isActive || !ctx || !canvas) return;

      // Throttle frame rate for consistent performance
      const elapsed = timestamp - lastFrameTime;
      if (elapsed < frameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = timestamp - (elapsed % frameInterval);

      // Fade effect - more aggressive fade for low-end devices
      const fadeOpacity = isLowEndDevice ? 0.15 : 0.1;
      ctx.fillStyle = `rgba(10, 10, 15, ${fadeOpacity})`;
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

        // Glow effect - skip on low-end devices for better performance
        if (!isLowEndDevice) {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2 * p.life, 0, Math.PI * 2);
          ctx.fill();
        }
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
      
      // Require more distance before creating particles on low-end devices
      const minDistance = isLowEndDevice ? 5 : 2;
      const maxCount = isLowEndDevice ? 3 : 5;
      
      if (distance > minDistance) {
        createParticles(mouseX, mouseY, Math.min(Math.floor(distance / 10), maxCount));
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
          // Fewer particles for touch on low-end devices
          const touchParticleCount = isLowEndDevice ? 2 : 3;
          createParticles(mouseX, mouseY, touchParticleCount);
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
    animationId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      isActive = false;
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [RAINBOW_MODE, COLOR, maxHeight, isLowEndDevice]);

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
