import { useEffect, useState } from 'react';

import { colors } from '@/theme';

// Розмір екрана iPhone, під який зроблено дизайн
const SCREEN_W = 390;
const SCREEN_H = 844;
const BEZEL = 14;

// На широкому екрані (комп'ютер) показуємо додаток у рамці телефона, а не розтягнутим на все вікно.
// Усередині рамки той самий додаток, відкритий у вбудованому вікні потрібного розміру.
export function shouldShowPhoneFrame() {
  if (typeof window === 'undefined') return false;
  const insideFrame = window.self !== window.top;
  return !insideFrame && window.innerWidth >= 700;
}

export function WebPhoneFrame() {
  const [scale, setScale] = useState(1);

  // Якщо вікно нижче за телефон, рамка пропорційно зменшується
  useEffect(() => {
    const fit = () => setScale(Math.min(1, (window.innerHeight - 48) / (SCREEN_H + BEZEL * 2)));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.background,
      }}
    >
      <div
        style={{
          width: SCREEN_W,
          height: SCREEN_H,
          padding: BEZEL,
          borderRadius: 60,
          background: '#1f1d1b',
          boxShadow: '0 24px 60px rgba(60, 40, 30, 0.18)',
          transform: `scale(${scale})`,
          flexShrink: 0,
        }}
      >
        <iframe
          title="Хатинка хвостиків"
          src={window.location.href}
          style={{
            width: SCREEN_W,
            height: SCREEN_H,
            border: 'none',
            borderRadius: 46,
            display: 'block',
            background: colors.background,
          }}
        />
      </div>
    </div>
  );
}
