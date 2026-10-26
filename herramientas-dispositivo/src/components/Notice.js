import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, radius } from '../theme/theme';
import Button from './Button';

const TONES = {
  info: { icon: 'information-circle', bg: 'surfaceAlt', fg: 'text' },
  error: { icon: 'alert-circle', bg: 'dangerBg', fg: 'danger' },
  warning: { icon: 'warning', bg: 'warningBg', fg: 'warning' },
  success: { icon: 'checkmark-circle', bg: 'successBg', fg: 'success' },
};

// Mensaje de estado (permiso denegado, error, función no disponible, éxito...).
// `actionTitle` + `onAction` agregan un botón opcional (p. ej. "Abrir ajustes").
export default function Notice({ tone = 'info', title, message, actionTitle, onAction }) {
  const t = useTheme();
  const cfg = TONES[tone];
  return (
    <View style={{ backgroundColor: t[cfg.bg], borderRadius: radius.md, padding: spacing.lg, gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Ionicons name={cfg.icon} size={22} color={t[cfg.fg]} />
        <Text style={{ color: t[cfg.fg], fontSize: 16, fontWeight: '700', flex: 1 }}>{title}</Text>
      </View>
      {message ? <Text style={{ color: t[cfg.fg], fontSize: 14, lineHeight: 20 }}>{message}</Text> : null}
      {actionTitle ? (
        <Button title={actionTitle} onPress={onAction} variant="secondary" style={{ marginTop: spacing.xs }} />
      ) : null}
    </View>
  );
}
