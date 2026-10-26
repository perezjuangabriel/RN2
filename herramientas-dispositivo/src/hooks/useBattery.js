import { useEffect, useState } from 'react';
import * as Battery from 'expo-battery';
import { isWeb } from '../utils/layout';

// En móvil: hooks oficiales de expo-battery (reciben eventos del sistema).
function useNativeBattery() {
  return {
    level: Battery.useBatteryLevel(),
    state: Battery.useBatteryState(),
    lowPower: Battery.useLowPowerMode(),
  };
}

// En navegador: el módulo web de expo-battery no admite suscripciones
// (los hooks oficiales fallan), así que se consulta cada pocos segundos.
function useWebBattery() {
  const [data, setData] = useState({ level: -1, state: Battery.BatteryState.UNKNOWN, lowPower: false });
  useEffect(() => {
    let alive = true;
    const read = async () => {
      try {
        const [level, state] = await Promise.all([Battery.getBatteryLevelAsync(), Battery.getBatteryStateAsync()]);
        if (alive) setData({ level, state, lowPower: false });
      } catch (e) {
        // Sin datos de batería: se mantiene el valor "no disponible".
      }
    };
    read();
    const id = setInterval(read, 5000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);
  return data;
}

// El entorno no cambia durante la ejecución, así que se elige un solo hook.
export const useBattery = isWeb ? useWebBattery : useNativeBattery;
