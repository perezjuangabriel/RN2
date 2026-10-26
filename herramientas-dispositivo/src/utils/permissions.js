import { Linking } from 'react-native';
import { isWeb } from './layout';

// Devuelve las props de <Notice> para un permiso denegado.
// Si el sistema ya no permite volver a preguntar, se ofrece abrir los ajustes.
export function deniedNotice(permission, what) {
  // En el navegador no existen los ajustes de la app: el permiso se cambia desde el candado de la barra de direcciones.
  if (isWeb) {
    return {
      tone: 'warning',
      title: 'Permiso denegado',
      message: `Para usar esta herramienta concede ${what} desde el icono del candado junto a la dirección del navegador y recarga la página.`,
    };
  }
  const canAskAgain = permission?.canAskAgain !== false;
  return {
    tone: 'warning',
    title: 'Permiso denegado',
    message: canAskAgain
      ? `Sin ${what} no se puede usar esta herramienta. Puedes volver a intentarlo.`
      : `Desactivaste ${what}. Actívalo en los ajustes de la aplicación para continuar.`,
    actionTitle: canAskAgain ? undefined : 'Abrir ajustes',
    onAction: canAskAgain ? undefined : () => Linking.openSettings(),
  };
}
