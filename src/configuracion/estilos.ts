// frontend-autos/src/configuracion/estilos.ts
import { Platform } from 'react-native';
/** Expo admite CSS de la web a través de $$css; Android usa StyleSheet/estilos nativos. */
export function estilo(nombre: string, nativo: any): any {
  return Platform.OS === 'web' ? { $$css: true, _: nombre } : nativo;
}
