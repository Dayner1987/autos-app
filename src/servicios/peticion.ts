// frontend-autos/src/servicios/peticion.ts
import { URL_API } from '../configuracion/api';

export class ErrorApi extends Error {
  constructor(public readonly codigo: number, mensaje: string) {
    super(mensaje);
    this.name = 'ErrorApi';
  }
}

export type Metodo = 'GET' | 'POST' | 'DELETE';

export async function peticion<T>(
  ruta: string,
  opciones: { metodo?: Metodo; token?: string; datos?: unknown } = {},
): Promise<T> {
  if (URL_API.includes('CAMBIA_AQUI_TU_IP')) {
    throw new ErrorApi(0, 'Abre src/configuracion/api.ts y cambia CAMBIA_AQUI_TU_IP por la IPv4 de tu computadora (ipconfig).');
  }

  let respuesta: Response;
  try {
    respuesta = await fetch(`${URL_API}/api${ruta}`, {
      method: opciones.metodo ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(opciones.datos !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(opciones.token ? { Authorization: `Bearer ${opciones.token}` } : {}),
      },
      ...(opciones.datos !== undefined ? { body: JSON.stringify(opciones.datos) } : {}),
    });
  } catch {
    throw new ErrorApi(0, 'No se pudo conectar a Strapi. Comprueba la IP en api.ts, la misma red Wi-Fi y el servidor en el puerto 1337.');
  }

  const contenido = await respuesta.text();
  let json: any = null;
  try {
    json = contenido ? JSON.parse(contenido) : null;
  } catch {
    // Algunos errores HTTP no devuelven JSON.
  }
  if (!respuesta.ok) {
    const descripcion = json?.error?.message || json?.message || `Error ${respuesta.status}`;
    throw new ErrorApi(respuesta.status, String(descripcion));
  }
  return json as T;
}

export function mensajeError(e: unknown): string {
  return e instanceof Error ? e.message : 'Ocurrió un error inesperado.';
}
