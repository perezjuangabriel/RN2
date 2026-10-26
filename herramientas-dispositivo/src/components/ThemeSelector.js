import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import { Body, Title } from './Heading';
import { useTheme, useThemeControls, spacing, radius } from '../theme/theme';

const OPTIONS = [
  { value: 'system', label: 'Automático', icon: 'contrast' },
  { value: 'light', label: 'Claro', icon: 'sunny' },
  { value: 'dark', label: 'Oscuro', icon: 'moon' },
];

// Selector de apariencia: Automático (sigue al sistema), Claro u Oscuro.
export default function ThemeSelector() {
  const t = useTheme();
  const { preference, setPreference } = useThemeControls();
  return (
    <Card>
      <Title>Apariencia</Title>
      <Body>Automático usa el modo de tu dispositivo o navegador.</Body>
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs }}>
        {OPTIONS.map((o) => {
          const selected = preference === o.value;
          const fg = selected ? t.onPrimary : t.text;
          return (
            <Pressable
              key={o.value}
              onPress={() => setPreference(o.value)}
              accessibilityRole="button"
              accessibilityLabel={`Modo ${o.label}`}
              accessibilityState={{ selected }}
              style={({ pressed }) => ({
                flex: 1,
                minHeight: 52,
                borderRadius: radius.sm,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                backgroundColor: selected ? t.primary : t.surfaceAlt,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons name={o.icon} size={20} color={fg} />
              <Text style={{ color: fg, fontSize: 13, fontWeight: '600' }}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}
