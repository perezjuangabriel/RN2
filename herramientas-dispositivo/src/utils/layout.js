import { Platform, useWindowDimensions } from 'react-native';

export const isWeb = Platform.OS === 'web';

// Ancho máximo del contenido: más ancho en navegador (PC), compacto en el móvil.
export const MAX_CONTENT_WIDTH = isWeb ? 960 : 640;
// Tamaño máximo de las vistas de cámara (evita visores gigantes en pantallas grandes).
export const MEDIA_MAX = 480;

// Ancho real que ocupa el contenido en la pantalla actual.
export function useContentWidth() {
  const { width } = useWindowDimensions();
  return Math.min(width, MAX_CONTENT_WIDTH);
}
