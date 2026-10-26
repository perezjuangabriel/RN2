import { useState } from 'react';
import { View, Text } from 'react-native';
import { CameraView, scanFromURLAsync } from 'expo-camera';
import * as Clipboard from 'expo-clipboard';
import CameraGate from '../components/CameraGate';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import Notice from '../components/Notice';
import { Body, Title } from '../components/Heading';
import { spacing, radius, useTheme } from '../theme/theme';
import { isWeb, useContentWidth, MEDIA_MAX } from '../utils/layout';

// Formatos admitidos: QR y los códigos de barras más comunes.
const BARCODE_TYPES = ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code39', 'code93', 'code128', 'itf14', 'codabar', 'pdf417', 'datamatrix', 'aztec'];

// Solo navegador: abre el selector de archivos y devuelve la imagen elegida (o null).
function pickImageFile() {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.oncancel = () => resolve(null);
    input.click();
  });
}

export default function ScannerScreen() {
  return (
    <CameraGate
      reason={
        isWeb
          ? 'Se usa la cámara web para leer códigos QR y de barras. También puedes leerlos desde una imagen. Nada se envía fuera de tu equipo.'
          : 'Se usa la cámara para leer códigos QR y códigos de barras. Nada se envía fuera del dispositivo.'
      }
    >
      <Scanner />
    </CameraGate>
  );
}

function Scanner() {
  const t = useTheme();
  const contentWidth = useContentWidth();
  const [result, setResult] = useState(null); // { data, type }
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [reading, setReading] = useState(false);

  const size = Math.min(contentWidth - spacing.lg * 2, MEDIA_MAX);

  const showResult = ({ data, type }) => {
    // Al guardar el resultado se desmonta el visor, evitando lecturas repetidas.
    setResult({ data, type });
    setCopied(false);
  };

  const copy = async () => {
    try {
      await Clipboard.setStringAsync(result.data);
      setCopied(true);
    } catch (e) {
      setError('No se pudo copiar el contenido al portapapeles.');
    }
  };

  // Solo navegador: lee un código desde un archivo de imagen.
  const scanImage = async () => {
    setError(null);
    const file = await pickImageFile();
    if (!file) return;
    setReading(true);
    const url = URL.createObjectURL(file);
    try {
      const found = await scanFromURLAsync(url, BARCODE_TYPES);
      if (found.length > 0) showResult(found[0]);
      else setError('No se encontró ningún código en la imagen.');
    } catch (e) {
      setError(`No se pudo leer la imagen: ${e.message ?? 'error desconocido'}`);
    } finally {
      URL.revokeObjectURL(url);
      setReading(false);
    }
  };

  return (
    <Screen>
      {error ? <Notice tone="error" title="Error" message={error} /> : null}
      {result ? (
        <Card>
          <Title>Código leído</Title>
          <Body>Tipo: {result.type}</Body>
          <View style={{ backgroundColor: t.surfaceAlt, borderRadius: radius.sm, padding: spacing.md }}>
            <Text selectable style={{ color: t.text, fontSize: 16, lineHeight: 22 }}>
              {result.data}
            </Text>
          </View>
          {copied ? <Notice tone="success" title="Copiado al portapapeles" /> : null}
          <Button title="Copiar contenido" icon="copy" onPress={copy} />
          <Button
            title="Escanear otro código"
            icon="scan"
            variant="secondary"
            onPress={() => {
              setResult(null);
              setError(null);
            }}
          />
        </Card>
      ) : (
        <>
          <View style={{ width: size, height: size, alignSelf: 'center', borderRadius: radius.md, overflow: 'hidden', backgroundColor: t.surfaceAlt }}>
            <CameraView
              style={{ flex: 1 }}
              facing={isWeb ? 'front' : 'back'}
              barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
              onBarcodeScanned={showResult}
              onMountError={(e) => setError(e.message ?? 'La cámara no pudo iniciarse.')}
            />
          </View>
          <Body style={{ textAlign: 'center' }}>Apunta la cámara al código. Se leerá automáticamente.</Body>
          {isWeb ? (
            <Button title="Leer desde una imagen" icon="image" variant="secondary" onPress={scanImage} loading={reading} />
          ) : null}
        </>
      )}
    </Screen>
  );
}
