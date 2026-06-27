import { useEffect, useRef, useState } from 'react';

interface InfiniteScrollProps {
  items: React.ReactNode[];
  speed?: number; // pixels per second
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
}

export function InfiniteScroll({ 
  items, 
  speed = 50, 
  direction = 'left',
  pauseOnHover = true 
}: InfiniteScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number>();
  const positionRef = useRef(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let lastTime = performance.now();
    const multiplier = direction === 'left' ? -1 : 1;

    const animate = (currentTime: number) => {
      if (!isPaused && container) {
        const deltaTime = (currentTime - lastTime) / 1000; // convert to seconds
        positionRef.current += speed * deltaTime * multiplier;

        // Get the width of one set of items
        const itemsWidth = container.scrollWidth / 2;

        // Reset position when one full set has scrolled
        if (Math.abs(positionRef.current) >= itemsWidth) {
          positionRef.current = 0;
        }

        container.style.transform = `translateX(${positionRef.current}px)`;
      }
      
      lastTime = currentTime;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed, direction, isPaused]);

  return (
    <div className="relative overflow-hidden py-8">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />
      
      <div
        ref={scrollRef}
        className="flex gap-8 items-center"
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        {/* Duplicate items for seamless loop */}
        {items}
        {items}
      </div>
    </div>
  );
}
