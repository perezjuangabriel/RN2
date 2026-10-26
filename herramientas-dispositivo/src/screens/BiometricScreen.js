import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import Constants from 'expo-constants';
import { isWeb } from '../utils/layout';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import Notice from '../components/Notice';
import Row from '../components/Row';
import { Body, Title } from '../components/Heading';

const TYPE_NAMES = {
  [LocalAuthentication.AuthenticationType.FINGERPRINT]: 'Huella dactilar',
  [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION]: 'Reconocimiento facial',
  [LocalAuthentication.AuthenticationType.IRIS]: 'Iris',
};

// Mensajes en español para los códigos de error más habituales.
const ERROR_TEXT = {
  user_cancel: 'Cancelaste la autenticación.',
  system_cancel: 'El sistema canceló la autenticación.',
  app_cancel: 'La aplicación canceló la autenticación.',
  user_fallback: 'Elegiste usar otro método de desbloqueo.',
  not_enrolled: 'No hay huellas ni rostros registrados en el dispositivo.',
  lockout: 'Demasiados intentos fallidos. Espera unos segundos e inténtalo de nuevo.',
  not_available: 'La autenticación biométrica no está disponible.',
  authentication_failed: 'No se reconoció la huella o el rostro.',
};

export default function BiometricScreen() {
  const [info, setInfo] = useState(null); // { hardware, enrolled, types }
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { ok, message }
  const [error, setError] = useState(null);

  const loadInfo = useCallback(async () => {
    try {
      const [hardware, enrolled, types] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
        LocalAuthentication.supportedAuthenticationTypesAsync(),
      ]);
      setInfo({ hardware, enrolled, types: types.map((t) => TYPE_NAMES[t]).filter(Boolean) });
    } catch (e) {
      setError(e.message ?? 'No se pudo consultar la biometría.');
    }
  }, []);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  const authenticate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verifica tu identidad',
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Usar código',
      });
      setResult(
        res.success
          ? { ok: true, message: 'Identidad verificada correctamente.' }
          : { ok: false, message: ERROR_TEXT[res.error] ?? `No se pudo autenticar (${res.error}).` }
      );
    } catch (e) {
      setError(e.message ?? 'Error durante la autenticación.');
    } finally {
      setLoading(false);
    }
  };

  const canAuth = info?.hardware && info?.enrolled;
  // Face ID no funciona dentro de Expo Go en iOS; solo en una compilación propia.
  const iosExpoGo = Platform.OS === 'ios' && Constants.executionEnvironment === 'storeClient';

  return (
    <Screen>
      {error ? <Notice tone="error" title="Error" message={error} /> : null}
      {info && !info.hardware ? (
        <Notice tone="warning" title="Sin hardware biométrico" message={
            isWeb
              ? 'Los navegadores de PC no permiten usar la huella ni el reconocimiento facial desde esta app. Prueba la herramienta en un teléfono, con Expo Go o con la APK.'
              : 'Este dispositivo no tiene lector de huellas ni reconocimiento facial.'
          }
        />
      ) : null}
      {info && info.hardware && !info.enrolled ? (
        <Notice
          tone="warning"
          title="Sin datos biométricos registrados"
          message="Registra una huella o un rostro en los ajustes de seguridad del teléfono y vuelve a esta pantalla."
          actionTitle="Volver a comprobar"
          onAction={loadInfo}
        />
      ) : null}
      {iosExpoGo ? (
        <Notice tone="info" title="Limitación de Expo Go en iPhone" message="Face ID no está disponible en Expo Go. Funciona en una compilación propia de la app." />
      ) : null}

      <Card>
        <Title>Compatibilidad</Title>
        <Row label="Hardware biométrico" value={info ? (info.hardware ? 'Sí' : 'No') : 'Comprobando…'} />
        <Row label="Datos registrados" value={info ? (info.enrolled ? 'Sí' : 'No') : 'Comprobando…'} />
        <Row label="Métodos admitidos" value={info ? (info.types.length ? info.types.join(', ') : 'Ninguno') : 'Comprobando…'} />
      </Card>

      {result ? (
        <Notice tone={result.ok ? 'success' : 'error'} title={result.ok ? 'Autenticación correcta' : 'Autenticación fallida'} message={result.message} />
      ) : (
        <Body>Pulsa el botón para verificar tu identidad con tu huella o rostro.</Body>
      )}

      <Button title="Autenticar" icon="finger-print" onPress={authenticate} loading={loading} disabled={!canAuth} />
    </Screen>
  );
}
