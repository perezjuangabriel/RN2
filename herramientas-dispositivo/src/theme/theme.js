import { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

// Paletas claro/oscuro. Todos los componentes leen sus colores de aquí.
const light = {
  mode: 'light',
  background: '#F2F5F2',
  surface: '#FFFFFF',
  surfaceAlt: '#E7EDE8',
  border: '#D5DED7',
  text: '#14201B',
  textMuted: '#5A6A61',
  primary: '#0E7C66',
  onPrimary: '#FFFFFF',
  danger: '#B3261E',
  dangerBg: '#FBE9E7',
  warning: '#8A5A00',
  warningBg: '#FFF1D6',
  success: '#17703F',
  successBg: '#DDF3E5',
};

const dark = {
  mode: 'dark',
  background: '#0D1411',
  surface: '#16201B',
  surfaceAlt: '#1F2C26',
  border: '#2B3B33',
  text: '#E8EFEA',
  textMuted: '#9DB0A5',
  primary: '#3DD6A8',
  onPrimary: '#062A20',
  danger: '#FF8A80',
  dangerBg: '#3A1D1A',
  warning: '#FFC66B',
  warningBg: '#3A2D12',
  success: '#7BE3A4',
  successBg: '#14301F',
};

// Tono propio de cada herramienta (se usa en el icono de la tarjeta).
export const toolTones = {
  camera: { light: '#C2410C', dark: '#FDBA74' },
  scanner: { light: '#6D28D9', dark: '#C4B5FD' },
  location: { light: '#0369A1', dark: '#7DD3FC' },
  sensors: { light: '#B45309', dark: '#FCD34D' },
  biometric: { light: '#BE185D', dark: '#F9A8D4' },
  device: { light: '#15803D', dark: '#86EFAC' },
  flashlight: { light: '#A16207', dark: '#FDE047' },
};

// Contexto del tema: guarda la preferencia del usuario ('system' | 'light' | 'dark').
// 'system' sigue el modo del teléfono o del navegador. La preferencia vive en memoria:
// al cerrar la app vuelve a 'system'.
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const system = useColorScheme();
  const [preference, setPreference] = useState('system');
  const mode = preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;
  const value = useMemo(
    () => ({ theme: mode === 'dark' ? dark : light, mode, preference, setPreference }),
    [mode, preference]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Paleta activa (la usan todos los componentes).
export function useTheme() {
  const ctx = useContext(ThemeContext);
  return ctx ? ctx.theme : light;
}

// Controles del tema: { mode, preference, setPreference }.
export function useThemeControls() {
  const ctx = useContext(ThemeContext);
  return ctx ?? { mode: 'light', preference: 'system', setPreference: () => {} };
}

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
export const radius = { sm: 10, md: 16, lg: 24 };
