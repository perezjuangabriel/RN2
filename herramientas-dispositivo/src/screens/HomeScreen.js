import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import ThemeSelector from '../components/ThemeSelector';
import { useContentWidth } from '../utils/layout';
import { Body } from '../components/Heading';
import { useTheme, toolTones, spacing, radius } from '../theme/theme';

// Catálogo de herramientas: añade una entrada aquí y en App.js para sumar otra pantalla.
export const TOOLS = [
  { route: 'Camera', tone: 'camera', icon: 'camera', title: 'Cámara', subtitle: 'Toma fotografías' },
  { route: 'Scanner', tone: 'scanner', icon: 'qr-code', title: 'Escáner', subtitle: 'QR y códigos de barras' },
  { route: 'Location', tone: 'location', icon: 'location', title: 'Ubicación', subtitle: 'GPS y precisión' },
  { route: 'Sensors', tone: 'sensors', icon: 'speedometer', title: 'Sensores', subtitle: 'Acelerómetro y giroscopio' },
  { route: 'Biometric', tone: 'biometric', icon: 'finger-print', title: 'Biometría', subtitle: 'Huella o rostro' },
  { route: 'Device', tone: 'device', icon: 'phone-portrait', title: 'Dispositivo', subtitle: 'Batería e información' },
  { route: 'Flashlight', tone: 'flashlight', icon: 'flashlight', title: 'Linterna', subtitle: 'Enciende el flash' },
];

export default function HomeScreen({ navigation }) {
  const t = useTheme();
  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 4 : width >= 600 ? 3 : 2;
  const contentWidth = useContentWidth() - spacing.lg * 2;
  const cardWidth = (contentWidth - spacing.md * (columns - 1)) / columns;

  return (
    <Screen>
      <Body>Elige una herramienta. Los permisos se piden solo cuando la usas.</Body>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
        {TOOLS.map((tool) => {
          const tint = toolTones[tool.tone][t.mode];
          return (
            <Pressable
              key={tool.route}
              onPress={() => navigation.navigate(tool.route)}
              accessibilityRole="button"
              accessibilityLabel={`${tool.title}: ${tool.subtitle}`}
              style={({ pressed }) => ({
                width: cardWidth,
                minHeight: 140,
                backgroundColor: t.surface,
                borderColor: t.border,
                borderWidth: 1,
                borderRadius: radius.md,
                padding: spacing.lg,
                justifyContent: 'space-between',
                opacity: pressed ? 0.75 : 1,
              })}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: radius.sm,
                  backgroundColor: tint + '26',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name={tool.icon} size={26} color={tint} />
              </View>
              <View style={{ gap: 2 }}>
                <Text style={{ color: t.text, fontSize: 17, fontWeight: '700' }}>{tool.title}</Text>
                <Text style={{ color: t.textMuted, fontSize: 13 }}>{tool.subtitle}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <ThemeSelector />
    </Screen>
  );
}
