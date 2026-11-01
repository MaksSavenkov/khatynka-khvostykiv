// На телефоні рамка не потрібна — версія для браузера лежить у WebPhoneFrame.web.tsx
export function shouldShowPhoneFrame() {
  return false;
}

export function WebPhoneFrame() {
  return null;
}
