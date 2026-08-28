import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  webpSrc?: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  webpSrc,
  alt,
  className = '',
  width,
  height,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 p-4 rounded-xl border border-slate-200 dark:border-slate-700 ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        <ImageOff className="w-6 h-6 mb-1 opacity-50" />
        <span className="text-[10px] font-medium text-center">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Progressive Skeleton Blur-up */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-inherit"
          aria-hidden="true" 
        />
      )}

      <picture>
        {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      </picture>
    </div>
  );
};
