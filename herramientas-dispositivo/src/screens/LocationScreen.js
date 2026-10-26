import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { isWeb } from '../utils/layout';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import Notice from '../components/Notice';
import Row from '../components/Row';
import { Body, Title } from '../components/Heading';
import { deniedNotice } from '../utils/permissions';

// Traduce la precisión horizontal (metros) a un nivel comprensible.
function accuracyLabel(meters) {
  if (meters == null) return 'Desconocida';
  if (meters <= 10) return `Alta (±${meters.toFixed(0)} m)`;
  if (meters <= 50) return `Media (±${meters.toFixed(0)} m)`;
  return `Baja (±${meters.toFixed(0)} m)`;
}

const fmt = (n, digits = 1, unit = '') => (n == null || Number.isNaN(n) ? '—' : `${n.toFixed(digits)}${unit}`);

export default function LocationScreen() {
  const subscription = useRef(null);
  const [permission, setPermission] = useState(null); // respuesta de permisos o null
  const [servicesOn, setServicesOn] = useState(true);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const stopTracking = useCallback(() => {
    subscription.current?.remove();
    subscription.current = null;
    setTracking(false);
  }, []);

  // Libera la suscripción al salir de la pantalla.
  useEffect(() => stopTracking, [stopTracking]);

  // Consulta (sin pedir) el estado actual del permiso al abrir la pantalla.
  useEffect(() => {
    Location.getForegroundPermissionsAsync().then(setPermission).catch(() => {});
  }, []);

  // Pide permiso (si hace falta) y comprueba que el GPS esté activado.
  const ensureReady = async () => {
    let perm = await Location.getForegroundPermissionsAsync();
    if (!perm.granted) perm = await Location.requestForegroundPermissionsAsync();
    setPermission(perm);
    if (!perm.granted) return false;
    const enabled = await Location.hasServicesEnabledAsync();
    setServicesOn(enabled);
    return enabled;
  };

  const getOnce = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!(await ensureReady())) return;
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setPosition(pos);
    } catch (e) {
      setError(`No se pudo obtener la ubicación: ${e.message ?? 'error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const startTracking = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!(await ensureReady())) return;
      subscription.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 1 },
        setPosition,
        (msg) => setError(`Error de seguimiento: ${msg}`)
      );
      setTracking(true);
    } catch (e) {
      setError(`No se pudo iniciar el seguimiento: ${e.message ?? 'error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const copyCoords = async () => {
    try {
      await Clipboard.setStringAsync(`${position.coords.latitude}, ${position.coords.longitude}`);
      setCopied(true);
    } catch (e) {
      setError('No se pudo copiar las coordenadas.');
    }
  };

  const c = position?.coords;
  const permText = permission == null ? 'Consultando…' : permission.granted ? 'Concedido' : permission.status === 'denied' ? 'Denegado' : 'Sin solicitar';
  const approximate = permission?.android?.accuracy === 'coarse';

  return (
    <Screen>
      {isWeb ? (
        <Notice
          tone="info"
          title="Ubicación aproximada en PC"
          message="Los PC no tienen GPS: el navegador estima tu posición por la red Wi‑Fi o la conexión, con una precisión que puede ser de cientos de metros o más. La altitud y la velocidad suelen no estar disponibles."
        />
      ) : null}
      {permission && !permission.granted && permission.status === 'denied' ? (
        <Notice {...deniedNotice(permission, 'el permiso de ubicación')} />
      ) : null}
      {!servicesOn ? (
        <Notice tone="warning" title="GPS desactivado" message="Activa la ubicación en los ajustes del teléfono y vuelve a intentarlo." />
      ) : null}
      {approximate ? (
        <Notice tone="info" title="Ubicación aproximada" message="Concediste solo la ubicación aproximada, por lo que la precisión será baja." />
      ) : null}
      {error ? <Notice tone="error" title="Error de ubicación" message={error} /> : null}

      <Card>
        <Title>Coordenadas</Title>
        {c ? (
          <>
            <Row label="Latitud" value={fmt(c.latitude, 6, '°')} />
            <Row label="Longitud" value={fmt(c.longitude, 6, '°')} />
            <Row label="Precisión" value={accuracyLabel(c.accuracy)} />
            <Row label="Altitud" value={fmt(c.altitude, 1, ' m')} />
            <Row label="Velocidad" value={c.speed != null && c.speed >= 0 ? fmt(c.speed * 3.6, 1, ' km/h') : '—'} />
            <Row label="Hora de la lectura" value={new Date(position.timestamp).toLocaleTimeString('es')} />
            {copied ? <Notice tone="success" title="Coordenadas copiadas" /> : null}
            <Button title="Copiar coordenadas" icon="copy" variant="secondary" onPress={copyCoords} />
          </>
        ) : (
          <Body>Aún no hay lecturas. Pulsa “Obtener ubicación” para empezar.</Body>
        )}
      </Card>

      <Card>
        <Title>Estado</Title>
        <Row label="Permiso de ubicación" value={permText} />
        <Row label="Seguimiento en vivo" value={tracking ? 'Activo' : 'Detenido'} />
      </Card>

      <Button title="Obtener ubicación" icon="locate" onPress={getOnce} loading={loading && !tracking} disabled={tracking} />
      {tracking ? (
        <Button title="Detener seguimiento" icon="stop-circle" variant="secondary" onPress={stopTracking} />
      ) : (
        <Button title="Seguir en vivo" icon="navigate" variant="secondary" onPress={startTracking} disabled={loading} />
      )}
    </Screen>
  );
}
