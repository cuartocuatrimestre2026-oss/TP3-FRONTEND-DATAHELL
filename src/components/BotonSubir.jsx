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
      className="theme-toggle-btn"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999,
        background: 'var(--brand-navy)',
        color: '#ffffff',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-highlight)',
        borderRadius: 'var(--radius-full)',
        padding: '10px 18px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer'
      }}
      aria-label="Volver al inicio de la página"
      title="Volver arriba"
    >
      <ArrowUp size={18} aria-hidden="true" />
      <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Arriba</span>
    </button>
  );
};
