import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import * as Battery from 'expo-battery';
import * as Device from 'expo-device';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Notice from '../components/Notice';
import Row from '../components/Row';
import { Title } from '../components/Heading';
import { isWeb } from '../utils/layout';
import { useBattery } from '../hooks/useBattery';

const STATE_TEXT = {
  [Battery.BatteryState.UNKNOWN]: 'Desconocido',
  [Battery.BatteryState.UNPLUGGED]: 'Descargando',
  [Battery.BatteryState.CHARGING]: 'Cargando',
  [Battery.BatteryState.FULL]: 'Completa',
};

const DEVICE_TYPES = {
  [Device.DeviceType.PHONE]: 'Teléfono',
  [Device.DeviceType.TABLET]: 'Tableta',
  [Device.DeviceType.DESKTOP]: 'Ordenador',
  [Device.DeviceType.TV]: 'Televisor',
  [Device.DeviceType.UNKNOWN]: 'Desconocido',
};

// Solo navegador: nombre del navegador según su identificador.
function browserName() {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return 'Microsoft Edge';
  if (/OPR\//.test(ua)) return 'Opera';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Chrome\//.test(ua)) return 'Chrome';
  if (/Safari\//.test(ua)) return 'Safari';
  return 'Desconocido';
}

export default function DeviceScreen() {
  const [available, setAvailable] = useState(null);
  const { level, state, lowPower } = useBattery();

  useEffect(() => {
    Battery.isAvailableAsync().then(setAvailable).catch(() => setAvailable(false));
  }, []);

  const memoryGb = Device.totalMemory ? `${(Device.totalMemory / 1024 ** 3).toFixed(1)} GB` : null;
  const batteryUnavailable = available === false || level < 0;
  const screen = Dimensions.get('screen');

  return (
    <Screen>
      {batteryUnavailable ? (
        <Notice
          tone="warning"
          title="Batería no disponible"
          message={
            isWeb
              ? 'Tu navegador no permite leer la batería. Prueba con Chrome o Edge; en un PC de escritorio no hay batería que leer.'
              : 'No se pudo leer el nivel de batería en este dispositivo.'
          }
        />
      ) : null}

      <Card>
        <Title>Batería</Title>
        <Row label="Nivel" value={level >= 0 ? `${Math.round(level * 100)} %` : null} />
        <Row label="Estado" value={STATE_TEXT[state]} />
        {isWeb ? null : <Row label="Ahorro de energía" value={lowPower ? 'Activado' : 'Desactivado'} />}
      </Card>

      <Card>
        <Title>{isWeb ? 'Equipo' : 'Dispositivo'}</Title>
        {isWeb ? null : <Row label="Marca" value={Device.brand} />}
        {isWeb ? null : <Row label="Modelo" value={Device.modelName} />}
        <Row label="Tipo" value={DEVICE_TYPES[Device.deviceType]} />
        <Row label="Sistema" value={Device.osName && `${Device.osName} ${Device.osVersion ?? ''}`} />
        <Row label="Memoria RAM" value={memoryGb} />
        {isWeb ? null : <Row label="Dispositivo físico" value={Device.isDevice ? 'Sí' : 'No (emulador)'} />}
      </Card>

      {isWeb ? (
        <Card>
          <Title>Navegador</Title>
          <Row label="Navegador" value={browserName()} />
          <Row label="Idioma" value={navigator.language} />
          <Row label="Núcleos del procesador" value={navigator.hardwareConcurrency} />
          <Row label="Pantalla" value={`${Math.round(screen.width)} × ${Math.round(screen.height)} px`} />
          <Row label="Conexión a internet" value={navigator.onLine ? 'Conectado' : 'Sin conexión'} />
        </Card>
      ) : null}
    </Screen>
  );
}
