import { useEffect, useState } from 'react';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { isWeb } from '../utils/layout';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import Notice from '../components/Notice';
import AxisBar from '../components/AxisBar';
import Row from '../components/Row';
import { Body, Title } from '../components/Heading';

const INTERVAL_MS = 100; // 10 lecturas por segundo: fluido sin saturar la interfaz.
const ZERO = { x: 0, y: 0, z: 0 };

export default function SensorsScreen() {
  const [available, setAvailable] = useState({ accel: null, gyro: null }); // null = comprobando
  const [accel, setAccel] = useState(ZERO);
  const [gyro, setGyro] = useState(ZERO);
  const [running, setRunning] = useState(true);
  const [error, setError] = useState(null);

  // Comprobación de disponibilidad (una sola vez).
  useEffect(() => {
    let alive = true;
    Promise.all([Accelerometer.isAvailableAsync(), Gyroscope.isAvailableAsync()])
      .then(([accelOk, gyroOk]) => alive && setAvailable({ accel: accelOk, gyro: gyroOk }))
      .catch((e) => alive && setError(e.message ?? 'No se pudo consultar los sensores.'));
    return () => {
      alive = false;
    };
  }, []);

  // Suscripción: se crea al iniciar y se elimina al pausar o salir de la pantalla.
  useEffect(() => {
    if (!running) return undefined;
    Accelerometer.setUpdateInterval(INTERVAL_MS);
    Gyroscope.setUpdateInterval(INTERVAL_MS);
    const subs = [];
    try {
      if (available.accel) subs.push(Accelerometer.addListener(setAccel));
      if (available.gyro) subs.push(Gyroscope.addListener(setGyro));
    } catch (e) {
      setError(e.message ?? 'No se pudo iniciar la lectura de sensores.');
    }
    return () => subs.forEach((s) => s.remove());
  }, [running, available]);

  const magnitude = Math.sqrt(accel.x ** 2 + accel.y ** 2 + accel.z ** 2);
  const checking = available.accel === null || available.gyro === null;
  const noneAvailable = !checking && !available.accel && !available.gyro;

  return (
    <Screen>
      {error ? <Notice tone="error" title="Error de sensores" message={error} /> : null}
      {noneAvailable ? (
        <Notice
          tone="warning"
          title="Sensores no disponibles"
          message={
            isWeb
              ? 'Los PC normalmente no tienen acelerómetro ni giroscopio. Abre esta app desde un teléfono para usar esta herramienta.'
              : 'Este dispositivo no tiene acelerómetro ni giroscopio accesibles. Prueba en un teléfono físico.'
          }
        />
      ) : null}

      {isWeb && !noneAvailable && !checking ? (
        <Notice
          tone="info"
          title="Lecturas del navegador"
          message="En el navegador, Expo obtiene estos valores a partir de la orientación del dispositivo, por lo que pueden no coincidir con los de la app instalada."
        />
      ) : null}

      <Card>
        <Title>Acelerómetro</Title>
        <Body>Aceleración en g (1 g ≈ gravedad terrestre). Inclina el teléfono para ver los cambios.</Body>
        {available.accel === false ? (
          <Notice tone="warning" title="Acelerómetro no disponible" />
        ) : (
          <>
            <AxisBar label="X" value={accel.x} range={2} unit="g" />
            <AxisBar label="Y" value={accel.y} range={2} unit="g" />
            <AxisBar label="Z" value={accel.z} range={2} unit="g" />
            <Row label="Magnitud total" value={`${magnitude.toFixed(2)} g`} />
          </>
        )}
      </Card>

      <Card>
        <Title>Giroscopio</Title>
        <Body>Velocidad de rotación en rad/s. Gira el teléfono para ver los cambios.</Body>
        {available.gyro === false ? (
          <Notice tone="warning" title="Giroscopio no disponible" message="Algunos dispositivos no incluyen este sensor." />
        ) : (
          <>
            <AxisBar label="X" value={gyro.x} range={5} unit="rad/s" />
            <AxisBar label="Y" value={gyro.y} range={5} unit="rad/s" />
            <AxisBar label="Z" value={gyro.z} range={5} unit="rad/s" />
          </>
        )}
      </Card>

      <Button
        title={running ? 'Pausar lecturas' : 'Reanudar lecturas'}
        icon={running ? 'pause' : 'play'}
        variant="secondary"
        onPress={() => setRunning((r) => !r)}
        disabled={checking || noneAvailable}
      />
    </Screen>
  );
}
