import React, { ReactNode } from 'react';

interface InfiniteCarouselProps {
  children: ReactNode;
  direction?: 'left' | 'right';
  speedSeconds?: number;
  pauseOnHover?: boolean;
  className?: string;
  fadeEdges?: boolean;
  gap?: string;
}

export const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
  children,
  direction = 'left',
  speedSeconds = 35,
  pauseOnHover = true,
  className = '',
  fadeEdges = true,
  gap = 'gap-6',
}) => {
  const animationClass =
    direction === 'left' ? 'animate-marquee-infinite' : 'animate-marquee-reverse-infinite';

  return (
    <div
      className={`relative w-full overflow-hidden ${
        fadeEdges ? 'carousel-mask-fade' : ''
      } ${pauseOnHover ? 'pause-on-hover' : ''} ${className}`}
      style={{
        // @ts-expect-error custom CSS variable for dynamic duration
        '--marquee-duration': `${speedSeconds}s`,
      }}
    >
      <div className={`${animationClass} flex shrink-0 items-center ${gap}`}>
        <div className={`flex shrink-0 items-center ${gap}`}>{children}</div>
        <div className={`flex shrink-0 items-center ${gap}`} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};
