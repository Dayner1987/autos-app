// frontend-autos/src/servicios/compras.ts
import type { Lista, Venta } from '../tipos/modelos';
import { peticion } from './peticion';
export async function solicitarCompra(token: string, datos: { autoDocumentId: string; nombreCompleto: string; celular: string; observaciones?: string }): Promise<void> {
  await peticion('/solicitudes-compra', { metodo: 'POST', token, datos });
}
export async function misSolicitudes(token: string): Promise<Venta[]> {
  const r = await peticion<Lista<Venta>>('/solicitudes-compra', { token });
  return r.data;
}
export async function cancelarSolicitud(token: string, id: string): Promise<void> {
  await peticion(`/solicitudes-compra/${encodeURIComponent(id)}`, { metodo: 'DELETE', token });
}
