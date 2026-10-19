// frontend-autos/src/servicios/sesion-almacenamiento.native.ts
import * as SecureStore from 'expo-secure-store';
const CLAVE = 'sesion-venta-autos';
export async function guardarToken(token: string | null): Promise<void> {
  if (token) await SecureStore.setItemAsync(CLAVE, token);
  else await SecureStore.deleteItemAsync(CLAVE);
}
export async function recuperarToken(): Promise<string | null> { return SecureStore.getItemAsync(CLAVE); }
