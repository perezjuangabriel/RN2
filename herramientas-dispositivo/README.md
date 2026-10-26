# Herramientas del Dispositivo

App React Native + Expo (SDK 58, JavaScript) con cámara, escáner QR/barras, GPS, acelerómetro/giroscopio, biometría, batería/dispositivo y linterna. Interfaz en español. Funciona en el móvil (Expo Go / APK) y en el navegador de un PC.

## Modo claro y oscuro
- Botón sol/luna en el encabezado de **todas** las pantallas.
- Selector «Apariencia» en la pantalla de inicio: Automático (sigue al sistema), Claro u Oscuro.
- La preferencia se guarda solo mientras la app está abierta.

## Estructura
```
App.js                       Navegación (stack) y tema de navegación
src/theme/theme.js           Paletas clara/oscura, espaciados, tonos por herramienta
src/components/              Screen, Card, Button, Notice, Row, Heading, AxisBar, CameraGate, ThemeToggle, ThemeSelector
src/hooks/useBattery.js      Batería (hooks oficiales en móvil; consulta periódica en web)
src/utils/layout.js          Ancho del contenido y detección de web
src/screens/                 Home, Camera, Scanner, Location, Sensors, Biometric, Device, Flashlight
src/utils/permissions.js     Mensaje común para permisos denegados / abrir ajustes
app.json                     Nombre, paquete Android, permisos, plugins
eas.json                     Perfil "preview" → APK instalable
```

## Dependencias
| Paquete | Para qué |
|---|---|
| expo-camera | Fotos, lectura de QR/barras, linterna (torch) |
| expo-location | Coordenadas, precisión, seguimiento |
| expo-sensors | Acelerómetro y giroscopio |
| expo-local-authentication | Huella / rostro |
| expo-battery, expo-device | Batería e información del equipo |
| expo-clipboard | Copiar el contenido leído |
| expo-constants | Detectar Expo Go (aviso de Face ID en iOS) |
| @react-navigation/native, native-stack, react-native-screens, react-native-safe-area-context | Navegación |
| @expo/vector-icons | Iconos |

## Instalar y ejecutar
```bash
npm install
npx expo start
```
Escanea el QR con **Expo Go** (misma red Wi‑Fi). Si Expo Go no abre el proyecto, actualiza Expo Go a una versión compatible con SDK 58.

## Versión web (PC)
```bash
npx expo start --web             # probar en el navegador (localhost)
npx expo export --platform web   # genera dist/ para publicar en un hosting con HTTPS
```
La cámara, la ubicación y los sensores exigen HTTPS (o localhost).

| Herramienta | En PC |
|---|---|
| Cámara | Usa la webcam; permite descargar la foto |
| Escáner | Webcam o lectura desde una imagen |
| Ubicación | Aproximada (red/Wi‑Fi); permite copiar coordenadas |
| Sensores | Solo si el equipo los tiene; si no, lo avisa |
| Biometría | No disponible en navegador; lo avisa |
| Batería y equipo | Batería solo en Chrome/Edge; datos del navegador y del equipo |
| Linterna | Sustituida por «luz de pantalla» blanca |

## Generar la APK con EAS
```bash
npm install -g eas-cli
eas login                          # cuenta gratuita en expo.dev
eas build:configure                # vincula el proyecto (crea projectId en app.json)
eas build --platform android --profile preview
```
Al terminar, EAS imprime un enlace de descarga (también en expo.dev → Builds). Antes de compilar, cambia `android.package` en `app.json` si `com.herramientas.dispositivo` ya está en uso por otra app.

## Instalar la APK
1. Abre el enlace de descarga en el teléfono Android (o escanea el QR de la página del build).
2. Descarga el `.apk` y ábrelo; si Android lo pide, permite "Instalar apps desconocidas" para el navegador.
3. Abre la app y prueba cada herramienta; los permisos se piden al usarla.
