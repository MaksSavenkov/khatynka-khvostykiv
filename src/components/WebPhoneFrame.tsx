// На телефоні рамка не потрібна — версія для браузера лежить у WebPhoneFrame.web.tsx
export function shouldShowPhoneFrame() {
  return false;
}

// На телефоні відступи дає сама система
export function iPhoneInsets(): { top: number; bottom: number; left: number; right: number } | null {
  return null;
}

export function WebPhoneFrame() {
  return null;
}
