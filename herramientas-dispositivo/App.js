import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme/theme';
import ThemeToggle from './src/components/ThemeToggle';

import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import LocationScreen from './src/screens/LocationScreen';
import SensorsScreen from './src/screens/SensorsScreen';
import BiometricScreen from './src/screens/BiometricScreen';
import DeviceScreen from './src/screens/DeviceScreen';
import FlashlightScreen from './src/screens/FlashlightScreen';

const Stack = createNativeStackNavigator();

// Direcciones del navegador (solo web): cada pantalla tiene su URL y el botón Atrás funciona.
const webLinking = {
  prefixes: [],
  config: {
    screens: {
      Home: '',
      Camera: 'camara',
      Scanner: 'escaner',
      Location: 'ubicacion',
      Sensors: 'sensores',
      Biometric: 'biometria',
      Device: 'dispositivo',
      Flashlight: 'linterna',
    },
  },
};

export default function App() {
  return (
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  );
}

function Root() {
  const t = useTheme();
  const base = t.mode === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: t.primary,
      background: t.background,
      card: t.surface,
      text: t.text,
      border: t.border,
    },
  };

  return (
    <SafeAreaProvider>
      {/* Se fija según el tema elegido, no según el del sistema */}
      <StatusBar style={t.mode === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer theme={navTheme} linking={Platform.OS === 'web' ? webLinking : undefined}>
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerTitleStyle: { fontWeight: '700' },
            headerBackTitle: 'Atrás',
            headerRight: () => <ThemeToggle />, // botón claro/oscuro en todas las pantallas
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Herramientas' }} />
          <Stack.Screen name="Camera" component={CameraScreen} options={{ title: 'Cámara' }} />
          <Stack.Screen name="Scanner" component={ScannerScreen} options={{ title: 'Escáner de códigos' }} />
          <Stack.Screen name="Location" component={LocationScreen} options={{ title: 'Ubicación y GPS' }} />
          <Stack.Screen name="Sensors" component={SensorsScreen} options={{ title: 'Acelerómetro y giroscopio' }} />
          <Stack.Screen name="Biometric" component={BiometricScreen} options={{ title: 'Biometría' }} />
          <Stack.Screen name="Device" component={DeviceScreen} options={{ title: 'Batería y dispositivo' }} />
          <Stack.Screen name="Flashlight" component={FlashlightScreen} options={{ title: 'Linterna' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
