import React, { useState } from 'react';

const FALLBACK_MAP = {
  avatar: '/assets/default-avatar.svg',
  building: '/assets/campus-placeholder.svg',
  department: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
  event: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
  article: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
  gallery: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
  logo: '/assets/logo.svg',
  general: '/assets/campus-placeholder.svg'
};

export default function ImageWithFallback({
  src,
  alt = 'Image',
  className = '',
  type = 'general',
  fallbackSrc,
  ...props
}) {
  const defaultFallback = fallbackSrc || FALLBACK_MAP[type] || FALLBACK_MAP.general;
  const [imgSrc, setImgSrc] = useState(src || defaultFallback);
  const [hasError, setHasError] = useState(false);

  // Sync if prop changes
  React.useEffect(() => {
    setImgSrc(src || defaultFallback);
    setHasError(false);
  }, [src, defaultFallback]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      if (imgSrc !== defaultFallback) {
        setImgSrc(defaultFallback);
      } else {
        // Ultimate fallback to local campus placeholder
        setImgSrc('/assets/campus-placeholder.svg');
      }
    }
  };

  return (
    <img
      src={imgSrc || '/assets/campus-placeholder.svg'}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
}
