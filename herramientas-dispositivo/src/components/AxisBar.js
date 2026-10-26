import { View, Text } from 'react-native';
import { useTheme, spacing } from '../theme/theme';

// Barra que parte del centro: positiva hacia la derecha, negativa hacia la izquierda.
export default function AxisBar({ label, value = 0, range, unit }) {
  const t = useTheme();
  const ratio = Math.max(-1, Math.min(1, value / range));
  const pct = Math.abs(ratio) * 50;
  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: t.textMuted, fontSize: 15 }}>Eje {label}</Text>
        <Text style={{ color: t.text, fontSize: 15, fontWeight: '700', fontVariant: ['tabular-nums'] }}>
          {value.toFixed(2)} {unit}
        </Text>
      </View>
      <View style={{ height: 14, borderRadius: 7, backgroundColor: t.surfaceAlt, overflow: 'hidden' }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: `${pct}%`,
            left: ratio >= 0 ? '50%' : `${50 - pct}%`,
            backgroundColor: t.primary,
            borderRadius: 7,
          }}
        />
        <View style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, marginLeft: -1, backgroundColor: t.border }} />
      </View>
    </View>
  );
}
