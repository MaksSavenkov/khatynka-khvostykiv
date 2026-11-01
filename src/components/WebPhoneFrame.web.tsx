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

// Відступи iPhone 13: рядок стану зверху й смужка «додому» знизу.
// Браузер на комп'ютері їх не має, тож у рамці телефона (і для демо-запису, адреса з ?iphone)
// підставляємо їх самі — тоді додаток розкладається точно як на телефоні.
export function iPhoneInsets() {
  if (typeof window === 'undefined') return null;
  const wanted = new URLSearchParams(window.location.search).has('iphone');
  return wanted ? { top: 47, bottom: 34, left: 0, right: 0 } : null;
}

// Та сама адреса, але з позначкою ?iphone — щоб у рамці були відступи справжнього телефона
function withIPhoneFlag(href: string) {
  const url = new URL(href);
  url.searchParams.set('iphone', '1');
  return url.toString();
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
          src={withIPhoneFlag(window.location.href)}
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
