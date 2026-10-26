import { useEffect, useRef, useState } from 'react';
import { Image, View } from 'react-native';
import { CameraView } from 'expo-camera';
import CameraGate from '../components/CameraGate';
import Screen from '../components/Screen';
import Button from '../components/Button';
import Notice from '../components/Notice';
import { Body } from '../components/Heading';
import { spacing, radius, useTheme } from '../theme/theme';
import { isWeb, useContentWidth, MEDIA_MAX } from '../utils/layout';

export default function CameraScreen() {
  return (
    <CameraGate
      reason={
        isWeb
          ? 'Se usa la cámara web para tomar fotografías. La foto se muestra aquí y puedes descargarla; no se envía a ningún servidor.'
          : 'Se usa la cámara para tomar fotografías. Las fotos se muestran en la aplicación y no se guardan en la galería.'
      }
    >
      <CameraCapture />
    </CameraGate>
  );
}

function CameraCapture() {
  const t = useTheme();
  const contentWidth = useContentWidth();
  const cameraRef = useRef(null);
  // En PC se parte de la cámara frontal (la webcam); en el móvil, de la trasera.
  const [facing, setFacing] = useState(isWeb ? 'front' : 'back');
  const [canFlip, setCanFlip] = useState(!isWeb);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);

  // En el navegador, el botón "Girar" solo tiene sentido si hay más de una cámara.
  useEffect(() => {
    if (!isWeb || !navigator.mediaDevices?.enumerateDevices) return;
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => setCanFlip(devices.filter((d) => d.kind === 'videoinput').length > 1))
      .catch(() => {});
  }, []);

  const previewSize = Math.min(contentWidth - spacing.lg * 2, MEDIA_MAX);
  const frame = {
    width: previewSize,
    height: previewSize * (4 / 3),
    alignSelf: 'center',
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: t.surfaceAlt,
  };

  const takePhoto = async () => {
    if (!cameraRef.current || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      setPhoto(result);
    } catch (e) {
      setError(`No se pudo tomar la foto: ${e.message ?? 'error desconocido'}`);
    } finally {
      setBusy(false);
    }
  };

  // Solo navegador: descarga la foto como archivo.
  const downloadPhoto = () => {
    const link = document.createElement('a');
    link.href = photo.uri;
    link.download = `foto-${Date.now()}.jpg`;
    link.click();
  };

  return (
    <Screen>
      {error ? <Notice tone="error" title="Error de cámara" message={error} /> : null}

      {photo ? (
        <>
          <Image source={{ uri: photo.uri }} style={frame} resizeMode="cover" accessibilityLabel="Fotografía tomada" />
          <Body style={{ textAlign: 'center' }}>
            Resolución: {photo.width} × {photo.height} px
          </Body>
          {isWeb ? <Button title="Descargar foto" icon="download" onPress={downloadPhoto} /> : null}
          <Button
            title="Tomar otra foto"
            icon="camera"
            variant={isWeb ? 'secondary' : 'primary'}
            onPress={() => setPhoto(null)}
          />
        </>
      ) : (
        <>
          <View style={frame}>
            <CameraView
              ref={cameraRef}
              style={{ flex: 1 }}
              facing={facing}
              onCameraReady={() => setReady(true)}
              onMountError={(e) => setError(e.message ?? 'La cámara no pudo iniciarse.')}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <Button title="Tomar foto" icon="camera" onPress={takePhoto} loading={busy} disabled={!ready} style={{ flex: 1 }} />
            {canFlip ? (
              <Button
                title="Girar"
                icon="camera-reverse"
                variant="secondary"
                onPress={() => {
                  setReady(false);
                  setFacing((f) => (f === 'back' ? 'front' : 'back'));
                }}
              />
            ) : null}
          </View>
        </>
      )}
    </Screen>
  );
}
