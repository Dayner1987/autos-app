// frontend-autos/src/servicios/sesion-almacenamiento.web.ts
// En web, localStorage persiste la sesión pero no protege el token ante XSS.
// Evita añadir scripts no confiables y utiliza HTTPS en producción.
const CLAVE = 'sesion-venta-autos';
export async function guardarToken(token: string | null): Promise<void> {
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem(CLAVE, token);
  else window.localStorage.removeItem(CLAVE);
}
export async function recuperarToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(CLAVE);
}
