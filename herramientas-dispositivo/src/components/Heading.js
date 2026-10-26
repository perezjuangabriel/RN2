import { Text } from 'react-native';
import { useTheme } from '../theme/theme';

export function Title({ children }) {
  const t = useTheme();
  return <Text style={{ color: t.text, fontSize: 18, fontWeight: '700' }}>{children}</Text>;
}

export function Body({ children, muted = true, style }) {
  const t = useTheme();
  return <Text style={[{ color: muted ? t.textMuted : t.text, fontSize: 15, lineHeight: 21 }, style]}>{children}</Text>;
}
