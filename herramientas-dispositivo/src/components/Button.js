import { Pressable, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, radius } from '../theme/theme';

// variant: 'primary' (relleno) | 'secondary' (contorno)
export default function Button({ title, onPress, icon, variant = 'primary', loading, disabled, style }) {
  const t = useTheme();
  const primary = variant === 'primary';
  const fg = primary ? t.onPrimary : t.primary;
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        {
          minHeight: 52,
          borderRadius: radius.sm,
          paddingHorizontal: spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
          backgroundColor: primary ? t.primary : 'transparent',
          borderWidth: primary ? 0 : 1.5,
          borderColor: t.primary,
          opacity: inactive ? 0.5 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={fg} /> : icon ? <Ionicons name={icon} size={20} color={fg} /> : null}
      <Text style={{ color: fg, fontSize: 16, fontWeight: '600' }}>{title}</Text>
    </Pressable>
  );
}
