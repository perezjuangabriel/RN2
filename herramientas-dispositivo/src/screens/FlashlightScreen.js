import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { CameraView } from 'expo-camera';
import CameraGate from '../components/CameraGate';
import Screen from '../components/Screen';
import Button from '../components/Button';
import Notice from '../components/Notice';
import { Body } from '../components/Heading';
import { isWeb } from '../utils/layout';

export default function FlashlightScreen() {
  // En PC no hay flash: se ofrece la pantalla como luz blanca (sin pedir permisos).
  if (isWeb) return <ScreenLight />;
  return (
    <CameraGate reason="Expo controla la linterna a través de la cámara, por eso se necesita el permiso de cámara. No se toman fotos.">
      <Flashlight />
    </CameraGate>
  );
}

function Flashlight() {
  const [on, setOn] = useState(false);
  const [error, setError] = useState(null);

  return (
    <Screen>
      {error ? <Notice tone="error" title="Linterna no disponible" message={error} /> : null}
      {/* Visor mínimo: la linterna solo funciona con la cámara activa. */}
      <View style={{ width: 1, height: 1, opacity: 0 }}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          enableTorch={on}
          onMountError={(e) => setError(e.message ?? 'No se pudo activar la cámara trasera.')}
        />
      </View>
      <Body>La linterna se apaga automáticamente al salir de esta pantalla.</Body>
      <Button
        title={on ? 'Apagar linterna' : 'Encender linterna'}
        icon={on ? 'flashlight' : 'flashlight-outline'}
        onPress={() => setOn((v) => !v)}
        disabled={Boolean(error)}
      />
    </Screen>
  );
}

// Alternativa para PC: la pantalla completa en blanco sirve como luz.
function ScreenLight() {
  const [on, setOn] = useState(false);

  if (on) {
    return (
      <Pressable
        onPress={() => setOn(false)}
        accessibilityRole="button"
        accessibilityLabel="Apagar luz de pantalla"
        style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ color: '#6B7280', fontSize: 16 }}>Toca la pantalla para apagar</Text>
      </Pressable>
    );
  }
  return (
    <Screen>
      <Notice
        tone="info"
        title="Linterna no disponible en PC"
        message="Los ordenadores no tienen flash. Como alternativa puedes usar la pantalla como luz blanca; sube el brillo del monitor para que ilumine más."
      />
      <Button title="Encender luz de pantalla" icon="sunny" onPress={() => setOn(true)} />
    </Screen>
  );
}
