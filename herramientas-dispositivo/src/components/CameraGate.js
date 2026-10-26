import { ActivityIndicator, View } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import Screen from './Screen';
import Card from './Card';
import Button from './Button';
import Notice from './Notice';
import { Body, Title } from './Heading';
import { useTheme } from '../theme/theme';
import { deniedNotice } from '../utils/permissions';
import { isWeb } from '../utils/layout';

// Pide el permiso de cámara SOLO cuando el usuario pulsa el botón.
// Cuando está concedido, renderiza `children`.
export default function CameraGate({ reason, children }) {
  const t = useTheme();
  const [permission, requestPermission] = useCameraPermissions();

  // Navegador sin acceso a cámara (típicamente una página sin HTTPS o un navegador antiguo).
  if (isWeb && !navigator.mediaDevices?.getUserMedia) {
    return (
      <Screen>
        <Notice
          tone="warning"
          title="Cámara no disponible en este navegador"
          message="El navegador solo permite usar la cámara en páginas seguras. Abre la app desde https:// o desde localhost, y usa una versión reciente de Chrome, Edge, Firefox o Safari."
        />
      </Screen>
    );
  }

  if (!permission) {
    return (
      <Screen scroll={false} style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={t.primary} />
      </Screen>
    );
  }
  if (permission.granted) return children;

  const denied = permission.status === 'denied';
  return (
    <Screen>
      {denied ? <Notice {...deniedNotice(permission, 'el permiso de cámara')} /> : null}
      <Card>
        <Title>Permiso de cámara</Title>
        <Body>{reason}</Body>
        {!denied || permission.canAskAgain ? (
          <View style={{ marginTop: 8 }}>
            <Button title="Permitir cámara" icon="camera" onPress={requestPermission} />
          </View>
        ) : null}
      </Card>
    </Screen>
  );
}
