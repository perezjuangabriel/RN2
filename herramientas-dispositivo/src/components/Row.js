import { View, Text } from 'react-native';
import { useTheme, spacing } from '../theme/theme';

// Fila "etiqueta : valor" para listas de datos.
export default function Row({ label, value }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, paddingVertical: 2 }}>
      <Text style={{ color: t.textMuted, fontSize: 15 }}>{label}</Text>
      <Text style={{ color: t.text, fontSize: 15, fontWeight: '600', flexShrink: 1, textAlign: 'right' }} selectable>
        {value ?? '—'}
      </Text>
    </View>
  );
}
