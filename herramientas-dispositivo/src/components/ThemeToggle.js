import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemeControls } from '../theme/theme';

// Botón del encabezado (visible en todas las pantallas): alterna claro/oscuro.
export default function ThemeToggle() {
  const t = useTheme();
  const { mode, setPreference } = useThemeControls();
  const toDark = mode !== 'dark';
  return (
    <Pressable
      onPress={() => setPreference(toDark ? 'dark' : 'light')}
      accessibilityRole="button"
      accessibilityLabel={toDark ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
      hitSlop={10}
      style={({ pressed }) => ({ padding: 6, opacity: pressed ? 0.6 : 1 })}
    >
      <Ionicons name={toDark ? 'moon' : 'sunny'} size={24} color={t.text} />
    </Pressable>
  );
}
