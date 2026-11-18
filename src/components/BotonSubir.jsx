import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BotonSubir = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      type="button"
      className="floating-top-btn"
      aria-label="Volver al inicio de la página"
      title="Volver arriba"
    >
      <ArrowUp size={16} aria-hidden="true" />
      <span>Arriba</span>
    </button>
  );
};
