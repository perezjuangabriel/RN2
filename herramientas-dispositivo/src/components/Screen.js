import { ScrollView, View } from 'react-native';
import { useTheme, spacing } from '../theme/theme';
import { useContentWidth } from '../utils/layout';

// Contenedor de pantalla con scroll. Limita el ancho en tabletas y monitores.
export default function Screen({ children, scroll = true, style }) {
  const t = useTheme();
  const maxWidth = useContentWidth();
  const content = (
    <View style={[{ width: '100%', maxWidth, alignSelf: 'center', padding: spacing.lg, gap: spacing.md }, style]}>
      {children}
    </View>
  );
  if (!scroll) {
    return <View style={{ flex: 1, backgroundColor: t.background }}>{content}</View>;
  }
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.background }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: spacing.xl * 2 }}
    >
      {content}
    </ScrollView>
  );
}
